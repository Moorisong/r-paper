'use strict';
require('dotenv').config();
const mongoose = require('mongoose');
const connectDatabase = require('../config/database');
const RollingPaper = require('../models/rolling-paper');
const Message = require('../models/message');

const randomMessages = [
  "축하해! 앞으로도 꽃길만 걷길 🌸",
  "항상 응원할게! 파이팅!",
  "정말 고마웠어. 잊지 못할 거야.",
  "앞으로도 건강하고 행복하자!",
  "우리가 함께한 시간들 정말 즐거웠어 😊",
  "새로운 시작을 진심으로 축하해!",
  "너의 앞날에 항상 행운이 가득하길 빌어",
  "어디서든 빛나는 네가 되길!",
  "늘 건강하고 좋은 일만 가득해라~",
  "너무너무 수고 많았어!",
  "정말 멋진 사람이야, 넌!",
  "너와 함께해서 영광이었어",
  "네가 가는 길을 언제나 응원해!",
  "소중한 인연 영원히 간직할게",
  "모든 일이 다 잘 될 거야!",
  "언제나 밝은 모습 잃지 마",
  "정말 대단해! 존경스러워",
  "너의 새로운 도전을 응원해!",
  "항상 웃는 일만 가득하길 바랄게",
  "네 덕분에 정말 많이 웃었어 😆"
];

async function seed() {
  await connectDatabase();
  const slug = 'lslyhVYm';
  
  try {
    const paper = await RollingPaper.findOne({ slug });
    if (!paper) {
      console.log(`Paper with slug ${slug} not found.`);
      process.exit(1);
    }
    
    console.log(`Found paper: ${paper.title} (${paper._id})`);
    
    const messagesToInsert = [];
    for (let i = 0; i < 15; i++) {
      const randomContent = randomMessages[Math.floor(Math.random() * randomMessages.length)];
      const msg = new Message({
        paperId: paper._id,
        content: randomContent + (Math.random() > 0.5 ? ' ✨' : ''),
      });
      await msg.validate();
      messagesToInsert.push(msg);
    }
    
    await Message.insertMany(messagesToInsert);
    console.log(`Successfully inserted 15 messages into paper ${slug}`);
  } catch (error) {
    console.error('Error seeding messages:', error);
  } finally {
    mongoose.connection.close();
    process.exit(0);
  }
}

seed();
