// CHUNITHM Character Data Import Script - Manual Copy Version
// This script extracts character data from CHUNITHM-NET and shows it for manual copying

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
    
    // Create textarea for manual copy
    const textarea = document.createElement('textarea');
    textarea.value = JSON.stringify(characters, null, 2);
    textarea.style = 'position:fixed;top:10px;left:10px;width:90vw;height:50vh;z-index:9999;';
    document.body.appendChild(textarea);
    
    setTimeout(() => {
      textarea.select();
      textarea.setSelectionRange(0, textarea.value.length);
    }, 0);
    
    alert('キャラクター情報をテキストエリアに出力しました。全選択→コピーしてツールに貼り付けてください。');
    
  } catch (error) {
    alert('キャラクター情報の取得に失敗しました: ' + error.message);
    console.error('CHUNITHM import error:', error);
  }
})();