// src/components/utils/krutiToUnicode.js

export const krutiToUnicode = (text) => {
  if (!text || typeof text !== 'string') return text;

  let modified_substring = text;

  // 1. Kruti Dev Input Characters (Order is CRITICAL: Longest strings first)
  const array_one = [
    // Double/Complex Characters
    "‘", "’", "“", "”", "(", ")", "{", "}", "=", "।", "?", "-", "µ", "॰", ",", ".", "् ",
    "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "x", 
    
    // Half letters and Ligatures (Replace these FIRST)
    "क्ष्", "ज्ञ्", "त्र्", "क्ष", "त्र", "ज्ञ",
    "त्त्", "त्त", "क्त", "दृ", "कृ", 
    
    // Matras & Special forms
    "å", "ƒ", "„", "…", "†", "‡", "ˆ", "‰", "Š", "‹", 
    "¶", "d", "[k", "x", "T", "t", "M+", "<+", "Q", ";", "j", "u",
    "Ù", "Ùk", "Dr", "–", "—", "à", "á", "â", "ã", "ºz", "º", "z", "è", "í", "{", "{k", "«", "«k", "u", "uk",
    "Z", "A", "\\", "&", "&", "Œ", "]", "-", "~ ", 
    
    // Standard Vowels/Matras mapped to Kruti keys
    "k", "h", "q", "w", "`", "s", "S", "ks", "kS", "a", "¡", "%", "~", 
    
    // Consonants & Vowels
    "v", "vk", "b", "Ã", "m", "Å", ",", ",s", "vks", "vkS", 
    "k", "d", "[", "?k", "?", "p", "N", "t", "X", "¥", 
    "V", "B", "M", "<", ".k", ".", "r", "F", "n", "/k", "/", "èk", "u", 
    "i", "Q", "c", "H", "e", "y", "o", "'", "\"", "l", "g", 
    "Î", "Ï", "Ò", "Ó", "Ô", "Ö", "Ø", "Ù", "Ü", "Ý", "Þ", "ß",
  ];

  const array_two = [
    "‘", "’", "“", "”", "(", ")", "{", "}", "=", "।", "?", "-", "µ", "॰", ",", ".", "् ",
    "०", "१", "२", "३", "४", "५", "६", "७", "८", "९", "x",
    
    "क्ष्", "ज्ञ्", "त्र्", "क्ष", "त्र", "ज्ञ",
    "त्त्", "त्त", "क्त", "दृ", "कृ",
    
    "hai", "I", "dn", "Q", ";", "j", "u", "i", "u", "i",
    "फ", "क", "ख", "ग", "झ", "ज", "ड़", "ढ़", "फ", "य", "र", "न",
    "त्त", "त्त", "क्त", "दृ", "कृ", "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष", "क्ष", "त्र", "त्र", "ज्ञ", "ज्ञ",
    "र्", "अ", "ऑ", "ओ", "औ", "आ", "इ", "ई", "उ", "ऊ", "ऐ",
    
    "ा", "ी", "ु", "ू", "ृ", "े", "ै", "ो", "ौ", "ं", "ँ", "ः", "्",
    
    "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ",
    "ा", "क", "ख", "घ", "घ", "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण", "ण", "त", "थ", "द", "ध", "ध", "ध", "न",
    "प", "फ", "ब", "भ", "म", "ल", "व", "श", "ष", "स", "ह",
    "ह्न", "ह्य", "हृ", "ह्म", "ह्र", "ह्", "द्द", "क्ष्", "क्ष", "त्र्", "त्र", "ज्ञ्", "ज्ञ"
  ];

  
  
  let text_array = modified_substring.split("");
  for (let i = 0; i < text_array.length; i++) {
    if (text_array[i] === "f") {
      if (i + 1 < text_array.length) {
        let temp = text_array[i + 1];
        text_array[i + 1] = text_array[i];
        text_array[i] = temp;              
        i++; 
      }
    }
  }
  modified_substring = text_array.join("");


  for (let i = 0; i < array_one.length; i++) {
    if (modified_substring.includes(array_one[i])) {

      let str_pattern = array_one[i].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      let regex = new RegExp(str_pattern, "g");
      modified_substring = modified_substring.replace(regex, array_two[i]);
    }
  }


  
  let words = modified_substring.split(" ");
  for (let w = 0; w < words.length; w++) {
    let word = words[w];
    if (word.includes("र्")) {
        let chars = word.split("");
        for (let i = 1; i < chars.length; i++) {
            if (chars[i] === "र्") {
                let temp = chars[i - 1];
                chars[i - 1] = chars[i];
                chars[i] = temp;
            }
        }
        words[w] = chars.join("");
    }
  }
  modified_substring = words.join(" ");

  modified_substring = modified_substring.replace(/f/g, "ि");

  return modified_substring;
};