//原字幕的span
const targetSpan = document.querySelector('.mejs-captions-text');
targetSpan.style.display = "block";
//再多一個字幕span
const newSibling = document.createElement('span');
newSibling.textContent = "";
newSibling.className="mejs-captions-text";
newSibling.style.display = "block";

// 找到原字幕的父節點
const parentElement = targetSpan.parentNode;
// 插入新字幕到原字幕的後面
parentElement.insertBefore(newSibling, targetSpan.nextSibling);


//將整篇文章存下來(英文)
let blocks = document.querySelectorAll('.block');
let article = '';
blocks.forEach(block => {
  let content = '';
  for (let node of block.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      content += node.textContent.trim();
    }
  }
  if (content !== '') {
    article += content.replace(/\n/g, " ") + ' ';
  }
});
console.log(article.trim());


//將字幕存成文章後翻成中文，存在paragraphs[]裡面，用句號做分割
let paragraphs;
translateWord(article).then((result)=>{
   console.log(result)
   paragraphs = result.split("。");
   captionChange();
})


//每秒去檢查原字幕，到目前有幾個"."，就顯示paragraphs[幾]，
let paraIndex=0;
let lastCaption="";
function captionChange(){
   if(targetSpan.innerHTML!=lastCaption){
      if(lastCaption.includes("."))paraIndex++
      lastCaption=targetSpan.innerHTML
   }
   // if(lastCaption=="")lastCaption=targetSpan.innerHTML
   // if(lastCaption.includes(".")&&targetSpan.innerHTML!=lastCaption){
   //    lastCaption=targetSpan.innerHTML
   //    paraIndex++
   // }
   // else{
   //    console.log("前",lastCaption.includes("."),lastCaption)
   //    console.log("後",targetSpan.innerHTML!=lastCaption)
   // }
   newSibling.innerHTML= paragraphs[paraIndex];
   requestAnimationFrame(captionChange);
}

//使用快捷鍵來+-paraIndex
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
   if (message.action === 'increase') {
      paraIndex++;
   } else if (message.action === 'decrease') {
      paraIndex--;
   } else if (message.action === 'start') {
      paraIndex=0;
   } else if (message.action === 'middle') {
      paraIndex=paragraphs.length/2;
   }
 });


//翻譯api
async function translateWord(word) {
    const  apiKey  = "";
  
    if (!apiKey) {
       console.error('API Key is not set. Please set it in the extension options.');
       return;
    }
  
    const endpoint = 'https://api.cognitive.microsofttranslator.com';
    const location = 'eastasia'; // 請將此替換為您的資源所在位置，例如：'eastus'。
  
    const url = `${endpoint}/translate?api-version=3.0&to=zh-Hant&textType=plain&includeAlignment=false&includeSentenceLength=false&profanityAction=NoAction&from=en`;
  
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Ocp-Apim-Subscription-Key', apiKey);
    headers.append('Ocp-Apim-Subscription-Region', location);
  
    const response = await fetch(url, {
       method: 'POST',
       headers,
       body: JSON.stringify([{ Text: word }]),
    });
  
    if (!response.ok) {
       console.error(`Azure Translator API returned an error: ${response.status}`);
       return;
    }
  
    try {
       const data = await response.json();
       return data[0].translations[0].text;
    }catch (error) {
       console.error('Error parsing JSON data from Azure Translator API:', error);
    }
}