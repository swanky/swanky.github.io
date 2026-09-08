import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const page = readFileSync(join(root, 'games/plum/index.html'), 'utf8');
const css = readFileSync(join(root, 'assets/css/plum-experience.css'), 'utf8');
const selectedWorks = readFileSync(join(root, '_data/selected_works.yml'), 'utf8');

const publicVideoId = 'E8Lgyx0X_s4';
const ep02VideoId = 'NMFgHt9YgE8';
const ep03VideoId = 'pOcVepABSt8';

test('《梅香境》頁首提供公開影片入口', () => {
  assert.match(page, /class="button button-ghost" href="#ep01-film">觀看 EP01 至 EP10 影像<\/a>/);
});

test('EP08〈紅妝鬥氣〉首映區與卡片觀看連結齊備', () => {
  assert.match(page, /<section id="ep08-film" class="cycle-premiere reveal"/);
  assert.match(page, /https:\/\/www\.youtube-nocookie\.com\/embed\/biJZfl92ys0/);
  assert.match(page, /title="《金瓶梅》影像十部曲 EP08〈紅妝鬥氣〉"/);
  assert.match(page, /<a class="cycle-watch-link" href="#ep08-film">/);
  assert.match(page, /<header><span>EP08<\/span><small>第八集已公開 · 取材自第四十、四十一回<\/small><\/header>/);
});

test('首頁精選作品提供 EP01 導流但不重複嵌入播放器', () => {
  assert.match(selectedWorks, /- num: "07"/);
  assert.match(selectedWorks, /title: 《金瓶異夢：十二花界》文學影像首集/);
  assert.match(selectedWorks, /url: "\/games\/plum\/#ep01-film"/);
  assert.match(selectedWorks, /meta: GAME · LITERARY FILM · AI/);
  assert.doesNotMatch(selectedWorks, /youtube(?:-nocookie)?\.com\/embed/);
});

test('文學十部曲以隱私強化的 YouTube iframe 公開 EP01', () => {
  assert.match(page, /<section id="ep01-film" class="cycle-premiere reveal"/);
  assert.match(page, new RegExp(`https://www\\.youtube-nocookie\\.com/embed/${publicVideoId}`));
  assert.match(page, /title="《金瓶梅》影像十部曲 EP01〈簾下遇金蓮〉"/);
  assert.match(page, /loading="lazy"/);
  assert.match(page, /allowfullscreen/);
  assert.match(page, new RegExp(`https://youtu\\.be/${publicVideoId}`));
  assert.doesNotMatch(page, new RegExp(`${publicVideoId}[^\n]+autoplay=1`));
});

test('EP01 對外說明清楚區分文學影像與遊戲實機', () => {
  const section = page.match(/<section id="ep01-film"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /AI 生成影像與語音/);
  assert.match(section, /不是遊戲實機畫面/);
  // 2026-08-08：第二、三回改為連向 /jinpingmei/text/ 原文書房的超連結
  assert.match(section, /取材自《金瓶梅》<a href="\{\{ '\/jinpingmei\/text\/002\/' \| relative_url \}\}">第二回<\/a>/);
});

test('EP01 卡片標示首集已公開並連回播放器', () => {
  const card = page.match(/<article class="cycle-card cycle-card-released reveal">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(card, /<span>EP01<\/span>/);
  assert.match(card, /首集已公開/);
  assert.match(card, /href="#ep01-film"/);
});

test('EP02 以隱私強化的 YouTube iframe 公開並連回播放器', () => {
  assert.match(page, /<section id="ep02-film" class="cycle-premiere reveal"/);
  assert.match(page, new RegExp(`https://www\\.youtube-nocookie\\.com/embed/${ep02VideoId}`));
  assert.match(page, /title="《金瓶梅》影像十部曲 EP02〈隔牆瓶兒〉"/);
  assert.match(page, new RegExp(`https://youtu\\.be/${ep02VideoId}`));
  const cards = page.match(/<article class="cycle-card cycle-card-released reveal">[\s\S]*?<\/article>/g) ?? [];
  const ep02Card = cards.find((c) => c.includes('<span>EP02</span>')) ?? '';
  assert.match(ep02Card, /第二集已公開/);
  assert.match(ep02Card, /href="#ep02-film"/);
});

test('EP03 以隱私強化的 YouTube iframe 公開並連回播放器', () => {
  assert.match(page, /<section id="ep03-film" class="cycle-premiere reveal"/);
  assert.match(page, new RegExp(`https://www\\.youtube-nocookie\\.com/embed/${ep03VideoId}`));
  assert.match(page, /title="《金瓶梅》影像十部曲 EP03〈燈樓群芳〉"/);
  assert.match(page, new RegExp(`https://youtu\\.be/${ep03VideoId}`));
  const section = page.match(/<section id="ep03-film"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /AI 生成影像與語音/);
  assert.match(section, /不是遊戲實機畫面/);
  assert.match(section, /取材自《金瓶梅》<a href="\{\{ '\/jinpingmei\/text\/015\/' \| relative_url \}\}">第十五回<\/a>/);
  const cards = page.match(/<article class="cycle-card cycle-card-released reveal">[\s\S]*?<\/article>/g) ?? [];
  const ep03Card = cards.find((c) => c.includes('<span>EP03</span>')) ?? '';
  assert.match(ep03Card, /第三集已公開/);
  assert.match(ep03Card, /href="#ep03-film"/);
});

test('EP01 播放器維持 16:9 並在窄螢幕改為單欄', () => {
  assert.match(css, /\.cycle-premiere-player iframe\s*\{[^}]*aspect-ratio:\s*16\s*\/\s*9/s);
  assert.match(css, /@media \(max-width: 900px\)[\s\S]*\.cycle-premiere\s*\{[^}]*grid-template-columns:\s*1fr/s);
});

test('EP09〈失子與離世〉首映區與卡片觀看連結齊備', () => {
  assert.match(page, /<section id="ep09-film" class="cycle-premiere reveal"/);
  assert.match(page, /https:\/\/www\.youtube-nocookie\.com\/embed\/HrYAmpOCAbQ/);
  assert.match(page, /title="《金瓶梅》影像十部曲 EP09〈失子與離世〉"/);
  assert.match(page, /https:\/\/youtu\.be\/HrYAmpOCAbQ/);
  assert.match(page, /<a class="cycle-watch-link" href="#ep09-film">/);
  assert.match(page, /<header><span>EP09<\/span><small>第九集已公開 · 取材自第五十九至六十二回<\/small><\/header>/);
  const section = page.match(/<section id="ep09-film"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /AI 生成影像與語音/);
  assert.match(section, /不是遊戲實機畫面/);
  assert.match(section, /7 分 14 秒/);
});

test('EP10〈月夜出門到重遊舊園〉首映區與 CODA 卡片齊備', () => {
  assert.match(page, /<section id="ep10-film" class="cycle-premiere reveal"/);
  assert.match(page, /https:\/\/www\.youtube-nocookie\.com\/embed\/E5xS8MkehNc/);
  assert.match(page, /title="《金瓶梅》影像十部曲 EP10〈月夜出門到重遊舊園〉"/);
  assert.match(page, /https:\/\/youtu\.be\/E5xS8MkehNc/);
  assert.match(page, /<a class="cycle-watch-link" href="#ep10-film">/);
  // CODA 卡片同時掛 released（金邊＋進度條滿格）與 coda（單欄寬版式）
  const codaCard = page.match(/<article class="cycle-card cycle-card-released cycle-card-coda reveal">[\s\S]*?<\/article>/)?.[0] ?? '';
  assert.match(codaCard, /<span>EP10<\/span>/);
  assert.match(codaCard, /第十集已公開 · 取材自第八十五至八十九、九十六回/);
  assert.match(codaCard, /href="#ep10-film"/);
  const section = page.match(/<section id="ep10-film"[\s\S]*?<\/section>/)?.[0] ?? '';
  assert.match(section, /7 分 52 秒/);
});

test('十部曲十集全數接上播放器，沒有集數還停在籌備狀態', () => {
  for (let n = 1; n <= 10; n += 1) {
    const id = `ep${String(n).padStart(2, '0')}-film`;
    assert.match(page, new RegExp(`<section id="${id}" class="cycle-premiere reveal"`), `${id} 首映區缺漏`);
  }
  const cards = page.match(/<article class="cycle-card[^"]*"[\s\S]*?<\/article>/g) ?? [];
  assert.equal(cards.length, 10, `十部曲卡片應為 10 張，實得 ${cards.length}`);
  for (const c of cards) {
    assert.match(c, /class="cycle-card[^"]*cycle-card-released/, `仍有卡片未標示已公開：${c.slice(0, 120)}`);
    assert.match(c, /class="cycle-watch-link"/, `仍有卡片沒有觀看連結：${c.slice(0, 120)}`);
  }
});
