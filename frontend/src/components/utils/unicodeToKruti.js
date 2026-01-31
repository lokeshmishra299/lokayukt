export const unicodeToKrutiDev = (text) => {
  if (!text || typeof text !== 'string') return "";

  let array_one = [
    "‘", "’", "“", "”", "(", ")", "{", "}", "=", "।", "?", "-", "µ", "॰", ",", ".", "् ",
    "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "x",
    "फ़", "क़", "ख़", "ज़", "ड़", "ढ़", "फ़", "य़", "ऱ", "ऩ",
    "त्त्", "त्त", "क्त", "दृ", "कृ",
    "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष्", "क्ष", "त्र्", "त्र", "ज्ञ्", "ज्ञ",
    "रु", "रू",
    "ा", "ि", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "ं", "ँ", "ः", "्",
    "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ", "ए", "ऐ", "ओ", "औ", "अं", "अः",
    "क", "ख", "ग", "घ", "ङ",
    "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण",
    "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म",
    "य", "र", "ल", "व", "श", "ष", "स", "ह",
    "श", "ष", "स", "ह",
    "ळ", "क्ष", "त्र", "ज्ञ",
    " ु", " ू", " ृ", " े", " ै", " ो", " ौ", " ं", " ँ", " ः", " ्", " ा", " ि", " ी"
  ];

  let array_two = [
    "^", "*", "Þ", "ß", "¼", "½", "¿", "À", "¾", "A", "\\", "&", "&", "Œ", "]", "-", "~ ",
    "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "Û",
    "¶", "d", "[k", "t", "M+", "<+", "Q", ";", "j", "u",
    "Ù", "Ùk", "Dr", "–", "—",
    "à", "á", "â", "ã", "ºz", "è", "í", "{", "{k", "«", "«k", "u", "uk",
    "#", ":",
    "k", "f", "h", "q", "w", "`", "s", "S", "ks", "kS", "a", "¡", "%", "~",
    "v", "vk", "b", "Ã", "m", "Å", ",", ",s", ",s", "vks", "vkS", "v", "v",
    "d", "[k", "x", "?k", "?",
    "p", "N", "t", "k", "×",
    "V", "B", "M", "<", ".k",
    "r", "Fk", "n", "èk", "u",
    "i", "Q", "c", "Hk", "e",
    ";", "j", "y", "o", "'k", "'k", "l", "g",
    "'k", "’k", "l", "g",
    "i", "{k", "«k", "K",
    " q", " w", " `", " s", " S", " ks", " kS", " a", " ¡", " %", " ~", " k", " f", " h"
  ];

  let modified_substring = text;

  // Substitute Characters using split/join (Safer than RegExp)
  for (let i = 0; i < array_one.length; i++) {
    if (array_one[i] !== "ि") {
       // यह तरीका ( और ) जैसे स्पेशल कैरेक्टर्स पर क्रैश नहीं होगा
       modified_substring = modified_substring.split(array_one[i]).join(array_two[i]);
    }
  }

  // Special Logic for Choti 'i' matra (ि)
  // Kruti Dev में मात्रा कैरेक्टर से पहले लगती है (जैसे: fd = कि)
  let position_of_i = modified_substring.indexOf("ि");
  while (position_of_i !== -1) {
      let character_to_left = modified_substring.charAt(position_of_i - 1);
      modified_substring = modified_substring.replace(character_to_left + "ि", "f" + character_to_left);
      position_of_i = modified_substring.indexOf("ि", position_of_i + 1);
  }
  
  // बची हुई 'ि' को 'f' से बदलें (अगर कोई छूट गई हो)
  modified_substring = modified_substring.split("ि").join("f");

  return modified_substring;
};