#!/usr/bin/env node
'use strict';

/**
 * 마이그레이션 스크립트: 기존 메시지에 expiresAt 필드 추가
 * 
 * 이 스크립트는 기존 메시지들에 부모 롤링페이퍼의 expiresAt 값을 복사합니다.
 * 롤링페이퍼가 이미 삭제된 고아 메시지들은 즉시 삭제됩니다.
 * 
 * 사용법: node migrate_message_ttl.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('./config/database');
const RollingPaper = require('./models/rolling-paper');
const Message = require('./models/message');

async function migrate() {
    try {
        console.log('🔄 MongoDB 연결 중...');
        await connectDatabase();

        if (mongoose.connection.readyState !== 1) {
            console.error('❌ MongoDB 연결 실패');
            process.exit(1);
        }

        const dbName = mongoose.connection.db.databaseName;
        console.log(`✅ 연결된 데이터베이스: ${dbName}`);

        // 1. expiresAt이 없는 메시지 찾기
        const messagesWithoutTTL = await Message.find({ expiresAt: { $exists: false } });
        console.log(`\n📋 expiresAt이 없는 메시지: ${messagesWithoutTTL.length}개`);

        if (messagesWithoutTTL.length === 0) {
            console.log('✅ 마이그레이션할 메시지가 없습니다.');
            await mongoose.disconnect();
            process.exit(0);
        }

        let updatedCount = 0;
        let orphanedCount = 0;
        const orphanedIds = [];

        // 2. 각 메시지에 대해 부모 롤링페이퍼의 expiresAt 복사
        for (const message of messagesWithoutTTL) {
            const paper = await RollingPaper.findById(message.paperId);

            if (!paper) {
                // 부모 롤링페이퍼가 없는 고아 메시지
                orphanedCount++;
                orphanedIds.push(message._id);
                continue;
            }

            // expiresAt 업데이트 (pre-save 훅을 거치지 않고 직접 업데이트)
            await Message.updateOne(
                { _id: message._id },
                { $set: { expiresAt: paper.expiresAt } }
            );
            updatedCount++;
        }

        console.log(`\n📊 마이그레이션 결과:`);
        console.log(`   ✅ 업데이트된 메시지: ${updatedCount}개`);
        console.log(`   🗑️  고아 메시지 발견: ${orphanedCount}개`);

        // 3. 고아 메시지 삭제
        if (orphanedIds.length > 0) {
            console.log(`\n🗑️  고아 메시지 삭제 중...`);
            const deleteResult = await Message.deleteMany({ _id: { $in: orphanedIds } });
            console.log(`   삭제 완료: ${deleteResult.deletedCount}개`);
        }

        console.log('\n✨ 마이그레이션 완료!');
        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ 에러 발생:', error);
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        process.exit(1);
    }
}

migrate();
