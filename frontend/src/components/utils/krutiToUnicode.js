// src/components/utils/krutiToUnicode.js

export const krutiToUnicode = (text) => {
  if (!text || typeof text !== 'string') return text; // Return original if not string

  let array_one = [
    // Kruti Dev characters
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
    // Mapping to Kruti Dev (We are reversing logic here)
    // Wait, the logic below maps Kruti (input) to Unicode (output)
    // Arrays below are standard mapping. 
    // Array_one = Unicode Target
    // Array_two = Kruti Source
    
    // BUT for Kruti to Unicode, we need to Swap the standard arrays used in UnicodeToKruti.
    // Let's use the standard replacement logic directly.
  ];
  
  // Simplified Mapping for Kruti (Input) -> Unicode (Output)
  // This array represents the Kruti Dev characters
  const kruti_chars = [
      "ñ", "Q+Z", "sas", "aa", ")Z", "Z", "δ", "‘", "’", "“", "”", "(", ")", "{", "}", "=", "।", "?", "-", "µ", "॰", ",", ".", "् ",
      "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "x", 
      "fl", "f", "k", "h", "q", "w", "`", "s", "S", "ks", "kS", "a", "¡", "%", "A", "\\", "&", "&", "Œ", "]", "-", "~ ", 
      "0", "1", "2", "3", "4", "5", "6", "7", "8", "9",
      "D", "[", "x", "?", "?k", "p", "N", "t", "T", ">", "¥", "V", "B", "M", "<", ".", ".k", "r", "F", "n", "/k", "u", "i", "Q", "c", "H", "e", ";", "j", "y", "o", "'", "\"", "l", "g", 
      "oZ", "¸", "kZ", "S", "å", "R", "U", "Dr", "z", "ª", "u", "v", "I", "i", "E", "l", "f", "d", "a", "¡", "H", "e", "Y", "w", "R", "u", "U", "m", "Z",
      "v", "vk", "b", "Ã", "m", "Å", ",", ",s", "vks", "vkS", "v", "v",
      "k", "h", "q", "w", "`", "s", "S", "ks", "kS", "a", "¡", "%", "~", "Z",
      "ç", "˜", "™", "ü", "ý", "å", "æ", "x", "?", "z"
  ];

  // This is a placeholder. Implementing full Kruti->Unicode is huge.
  // Instead, use this optimized mapping logic:

  let modified_substring = text;

  // 1. Special Replacements first
  modified_substring = modified_substring.replace(/±/g, "Zं"); // Example fix
  modified_substring = modified_substring.replace(/Æ/g, "र्f"); 
  
  // 2. Handle 'f' (Choti Ee) - It comes BEFORE letter in Kruti, but needs to be AFTER in Unicode
  // Logic: "f" + "k" (कि) -> "क" + "ि"
  // We need to swap 'f' with the next character.
  // Warning: This is complex because "next character" can be a half letter combo.
  
  // Simple swap for single characters (Most common):
  // Finds 'f' followed by any character, swaps them, and changes 'f' to 'ि'
  // Note: This requires a robust loop to handle half-chars correctly.
  
  let text_size = modified_substring.length;
  let processed_text = "";
  
  // IMPORTANT: For a perfect converter, using a library like 'kruti-dev-to-unicode' package is better.
  // But here is a functional manual replacement for basic characters.
  
  const mapping = {
      'k': 'क', 'd': 'क', '[k': 'ख', 'x': 'ग', '?k': 'घ', '?': 'घ',
      'p': 'च', 'N': 'छ', 't': 'ज', 'T': 'झ', '>': 'झ', '¥': 'ञ',
      'V': 'ट', 'B': 'ठ', 'M': 'ड', '<': 'ढ', '.': 'ण', '.k': 'ण',
      'r': 'त', 'F': 'थ', 'n': 'द', '/k': 'ध', 'u': 'न',
      'i': 'प', 'Q': 'फ', 'c': 'ब', 'H': 'भ', 'e': 'म',
      ';': 'य', 'j': 'र', 'y': 'ल', 'o': 'व', "'": 'श', "\"": 'ष', 'l': 'स', 'g': 'ह',
      'v': 'अ', 'vk': 'आ', 'b': 'इ', 'Ã': 'ई', 'm': 'उ', 'Å': 'ऊ', ',': 'ए', ',s': 'ऐ', 'vks': 'ओ', 'vkS': 'औ',
      'k': 'ा', 'f': 'ि', 'h': 'ी', 'q': 'ु', 'w': 'ू', '`': 'ृ', 's': 'े', 'S': 'ै', 'ks': 'ो', 'kS': 'ौ', 'a': 'ं', '¡': 'ँ', '%': 'ः',
      'Z': 'र्', '~': '्' 
      // ... Add more mappings based on your garbage output
  };

  // Note: Writing a full parser manually here is error-prone. 
  // I strongly recommend using the Google Transliterate logic or the reverse mapping of your 'unicodeToKruti'.
  // However, since you used `unicodeToKruti`, let's try to reverse THAT specific logic.
  
  // REVERSE OF YOUR unicodeToKruti.js
  let array_two_rev = [
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

  let array_one_rev = [
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

  // 1. Handle Matra 'f' (Choti Ee) first - SWAP LOGIC
  // Logic: In Kruti "f" comes before letter (fd), in Unicode it comes after (कि)
  // We find 'f' and the character AFTER it, and swap them.
  let f_pos = modified_substring.indexOf("f");
  while (f_pos !== -1) {
      let char_after_f = modified_substring.charAt(f_pos + 1);
      // Replace 'f' + 'char' with 'char' + 'ि' (which we will map later, for now lets use a placeholder or assume mapping handles 'f'->'ि')
      // Actually, we should just swap the characters in the string first
      if (char_after_f) {
          let part1 = modified_substring.substring(0, f_pos);
          let part2 = modified_substring.substring(f_pos + 2);
          modified_substring = part1 + char_after_f + "f" + part2; 
          // Move search forward
          f_pos = modified_substring.indexOf("f", f_pos + 2); 
      } else {
          break;
      }
  }

  // 2. Perform Replacements
  for (let i = 0; i < array_two_rev.length; i++) {
     if (array_two_rev[i] !== "") {
        // Using split/join to replace all occurrences
        modified_substring = modified_substring.split(array_two_rev[i]).join(array_one_rev[i]);
     }
  }

  return modified_substring;
};