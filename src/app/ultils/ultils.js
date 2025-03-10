export const GenerateRandomHash = (length = 8) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let hash = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    hash += characters[randomIndex];
  }

  return hash;
};

export const saveHashToSession = (hash) => {
  sessionStorage.setItem("sessionHash", hash);
  console.log(`✅ Hash salvo: ${hash}`);
};

export const getHashFromSession = () => {
  const hash = sessionStorage.getItem("sessionHash");
  if (hash) {
    console.log(`🔍 Hash recuperado: ${hash}`);
    return hash;
  } else {
    console.log("⚠️ Nenhum hash encontrado.");
    return null;
  }
};

export const removeHashFromSession = () => {
  sessionStorage.removeItem("sessionHash");
  console.log("🗑️ Hash removido do sessionStorage.");
};
