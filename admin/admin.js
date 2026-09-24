const adminScript = [...document.scripts].find((script) => script.src.includes('admin.js'));
const liveStoreLink = document.querySelector('.follow-area > p');
if (liveStoreLink && adminScript) {
  const nestedAdminPage = adminScript.getAttribute('src').startsWith('../');
  liveStoreLink.innerHTML = `<a href="${nestedAdminPage ? '../../index.html' : '../index.html'}">View Live Store</a>`;
}

const ruwaAdminReplacements = new Map([
  ['Perfume Store', 'Ruwa Biosciences'], ['fragrance', 'medical equipment'], ['Fragrance', 'Medical equipment'],
  ['signature scents', 'healthcare products'], ['scent', 'product specification'], ['My Journal', 'Ruwa Resources'],
  ['rituals, and craft', 'diagnostics, equipment, and supply'], ['Store activity', 'Catalogue activity'],
  ['Store overview', 'Ruwa overview'], ['Store profile', 'Ruwa profile'], ['Store preferences', 'Catalogue preferences'],
  ['USD — United States Dollar', 'KES — Kenyan Shilling'], ['USD', 'KES'], ['All Natural', 'Ruwa Biosciences'], ['Lorian', 'Ruwa admin'],
  ['Pure Cleanser', 'Malaria PF/PAN'], ['Glow Serum', 'Mission Hb Machine'], ['Dew Toner', 'Urinalysis Strips'], ['Balance Moisturizer', 'Patient Monitor'],
  ['Aura Eye Cream', 'H. Pylori Ag'], ['Mineral SPF 30', 'Sinocare Blood Sugar Machine'], ['Silk Body Wash', 'Red Top Vacutainer Tubes'], ['Renew Scrub', 'Blood Grouping Set'],
  ['PS-1048', 'RW-1048'], ['PS-1047', 'RW-1047'], ['PS-1046', 'RW-1046'], ['PS-1045', 'RW-1045'], ['PS-1044', 'RW-1044']
]);
const rewriteRuwaAdminText = (value) => { let result = value; ruwaAdminReplacements.forEach((replacement, original) => { result = result.replaceAll(original, replacement); }); return result; };
const adminWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
const adminNodes = []; while (adminWalker.nextNode()) adminNodes.push(adminWalker.currentNode);
adminNodes.forEach((node) => { if (!['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName)) node.nodeValue = rewriteRuwaAdminText(node.nodeValue).replace(/\$(\d[\d,.]*)/g, 'KES $1'); });
document.title = rewriteRuwaAdminText(document.title);
