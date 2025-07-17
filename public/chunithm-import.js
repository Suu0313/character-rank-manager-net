// CHUNITHM Character Data Import Script
// This script extracts character data from CHUNITHM-NET and imports it to the character rank manager

(async () => {
  const ipId = 'ipId14';
  
  try {
    // Fetch character list page
    const response = await fetch('https://new.chunithm-net.com/chuni-mobile/html/mobile/collection/characterList/', {
      credentials: 'include'
    });
    
    const htmlText = await response.text();
    const doc = new DOMParser().parseFromString(htmlText, 'text/html');
    
    // Extract character data
    const characters = [...doc.querySelectorAll('div.box01[name^="' + ipId + '"]')].map(element => {
      const name = element.querySelector('.character_name_block a')?.textContent.trim() || '';
      const id = element.getAttribute('name') || '';
      
      // Filter out non-matching IDs
      if (id !== ipId && !id.startsWith(ipId + '-')) return null;
      
      const img = element.querySelector('.list_chara_img img')?.getAttribute('data-original') || 'no_image.png';
      const rank = [...element.querySelectorAll('.character_list_rank_num_block img')]
        .map(x => (x.getAttribute('src') || '').match(/num_s_lv_(\d)\.png/)?.[1] || "")
        .join("");
      const isMax = !!element.querySelector('.character_list_rank_max');
      
      return {
        name: name,
        charaId: id,
        imgSrc: img,
        rank: rank,
        isMax: isMax
      };
    }).filter(Boolean);
    
    // Prepare compressed format
    const baseUrl = 'https://new.chunithm-net.com/chuni-mobile/html/mobile/img/';
    const compressed = characters.map(c => [
      c.name,
      c.charaId,
      c.imgSrc.startsWith(baseUrl) ? c.imgSrc.substring(baseUrl.length) : c.imgSrc,
      c.rank,
      c.isMax ? 1 : 0
    ]);
    
    // LZ compression function
    function lzCompress(data) {
      const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$";
      let getCharFromInt = String.fromCharCode;
      let dictionary = {};
      let dictToCreate = {};
      let c = "";
      let wc = "";
      let w = "";
      let enlargeIn = 2;
      let dictSize = 3;
      let numBits = 2;
      let result = [];
      let data_val = 0;
      let data_position = 0;

      if (data == null) return "";
      
      for (let ii = 0; ii < data.length; ii++) {
        c = data.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(dictionary, c)) {
          dictionary[c] = dictSize++;
          dictToCreate[c] = true;
        }

        wc = w + c;
        if (Object.prototype.hasOwnProperty.call(dictionary, wc)) {
          w = wc;
        } else {
          if (Object.prototype.hasOwnProperty.call(dictToCreate, w)) {
            if (w.charCodeAt(0) < 256) {
              for (let i = 0; i < numBits; i++) {
                data_val = (data_val << 1);
                if (data_position == 5) {
                  data_position = 0;
                  result.push(keyStr.charAt(data_val));
                  data_val = 0;
                } else {
                  data_position++;
                }
              }
              let value = w.charCodeAt(0);
              for (let i = 0; i < 8; i++) {
                data_val = (data_val << 1) | (value & 1);
                if (data_position == 5) {
                  data_position = 0;
                  result.push(keyStr.charAt(data_val));
                  data_val = 0;
                } else {
                  data_position++;
                }
                value = value >> 1;
              }
            } else {
              let value = 1;
              for (let i = 0; i < numBits; i++) {
                data_val = (data_val << 1) | value;
                if (data_position == 5) {
                  data_position = 0;
                  result.push(keyStr.charAt(data_val));
                  data_val = 0;
                } else {
                  data_position++;
                }
                value = 0;
              }
              value = w.charCodeAt(0);
              for (let i = 0; i < 16; i++) {
                data_val = (data_val << 1) | (value & 1);
                if (data_position == 5) {
                  data_position = 0;
                  result.push(keyStr.charAt(data_val));
                  data_val = 0;
                } else {
                  data_position++;
                }
                value = value >> 1;
              }
            }
            enlargeIn--;
            if (enlargeIn == 0) {
              enlargeIn = Math.pow(2, numBits);
              numBits++;
            }
            delete dictToCreate[w];
          } else {
            let value = dictionary[w];
            for (let i = 0; i < numBits; i++) {
              data_val = (data_val << 1) | (value & 1);
              if (data_position == 5) {
                data_position = 0;
                result.push(keyStr.charAt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value = value >> 1;
            }
          }
          enlargeIn--;
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
          dictionary[wc] = dictSize++;
          w = String(c);
        }
      }

      if (w !== "") {
        if (Object.prototype.hasOwnProperty.call(dictToCreate, w)) {
          if (w.charCodeAt(0) < 256) {
            for (let i = 0; i < numBits; i++) {
              data_val = (data_val << 1);
              if (data_position == 5) {
                data_position = 0;
                result.push(keyStr.charAt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
            }
            let value = w.charCodeAt(0);
            for (let i = 0; i < 8; i++) {
              data_val = (data_val << 1) | (value & 1);
              if (data_position == 5) {
                data_position = 0;
                result.push(keyStr.charAt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value = value >> 1;
            }
          } else {
            let value = 1;
            for (let i = 0; i < numBits; i++) {
              data_val = (data_val << 1) | value;
              if (data_position == 5) {
                data_position = 0;
                result.push(keyStr.charAt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value = 0;
            }
            value = w.charCodeAt(0);
            for (let i = 0; i < 16; i++) {
              data_val = (data_val << 1) | (value & 1);
              if (data_position == 5) {
                data_position = 0;
                result.push(keyStr.charAt(data_val));
                data_val = 0;
              } else {
                data_position++;
              }
              value = value >> 1;
            }
          }
          enlargeIn--;
          if (enlargeIn == 0) {
            enlargeIn = Math.pow(2, numBits);
            numBits++;
          }
          delete dictToCreate[w];
        } else {
          let value = dictionary[w];
          for (let i = 0; i < numBits; i++) {
            data_val = (data_val << 1) | (value & 1);
            if (data_position == 5) {
              data_position = 0;
              result.push(keyStr.charAt(data_val));
              data_val = 0;
            } else {
              data_position++;
            }
            value = value >> 1;
          }
        }
        enlargeIn--;
        if (enlargeIn == 0) {
          enlargeIn = Math.pow(2, numBits);
          numBits++;
        }
      }

      let value = 2;
      for (let i = 0; i < numBits; i++) {
        data_val = (data_val << 1) | (value & 1);
        if (data_position == 5) {
          data_position = 0;
          result.push(keyStr.charAt(data_val));
          data_val = 0;
        } else {
          data_position++;
        }
        value = value >> 1;
      }

      while (true) {
        data_val = (data_val << 1);
        if (data_position == 5) {
          result.push(keyStr.charAt(data_val));
          break;
        } else {
          data_position++;
        }
      }
      return result.join('');
    }
    
    // Compress and create URL
    const compressedData = lzCompress(JSON.stringify(compressed));
    const url = 'https://Suu0313.github.io/character-rank-manager-net/import?data=' + compressedData;
    
    // Handle large data or redirect
    if (compressedData.length > 20000) {
      // Large data - show manual copy interface
      const textarea = document.createElement('textarea');
      textarea.value = JSON.stringify(characters, null, 2);
      textarea.style = 'position:fixed;top:10px;left:10px;width:90vw;height:50vh;z-index:9999;';
      document.body.appendChild(textarea);
      setTimeout(() => {
        textarea.select();
        textarea.setSelectionRange(0, textarea.value.length);
      }, 0);
      alert('データが大きすぎるため、手動でコピーしてください。 ' + compressedData.length + ' 文字');
    } else {
      // Normal size - redirect to import page
      window.open(url, '_blank');
    }
    
  } catch (error) {
    alert('キャラクター情報の取得に失敗しました: ' + error.message);
    console.error('CHUNITHM import error:', error);
  }
})();