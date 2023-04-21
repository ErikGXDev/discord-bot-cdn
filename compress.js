const charset =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

base = BigInt(charset.length);

function compressNumber(num) {
  let encoded = "";
  num = BigInt(num);
  while (num) {
    encoded = charset[Number(num % base)] + encoded;
    num = num / base;
  }
  return encoded;
}

function decompressNumber(str) {
  let decoded = BigInt(0);
  for (let i = 0; i < str.length; i++) {
    decoded = decoded * base + BigInt(charset.indexOf(str[i]));
  }
  return decoded;
}

module.exports = { compressNumber, decompressNumber };
