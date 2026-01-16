export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

export const formatDday = (expiresAt) => {
  const now = new Date();
  const expireDate = new Date(expiresAt);
  const diffTime = expireDate - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return '곧 사라집니다';
  }

  return `${diffDays}일 후 사라집니다`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
