const workflow = {
  intake: { title: '公告与样本核验', copy: '核对样本是否属于开发集、校验原始 PDF 的 SHA-256，并把每次处理写入独立运行记录。测试集样本会在处理前被拒绝。', status: '已接入', meta: '只读原件 · 不覆盖旧运行', index: '01' },
  text: { title: '文字提取与 OCR 分流', copy: '优先读取 PDF 文本层，并记录页码与文本质量。扫描件会进入 OCR 分流；当前环境尚未配置可用 OCR 引擎，因此不能把扫描件识别描述为已完成。', status: '部分接入', meta: 'PDF 文本层已接入 · OCR 待配置', index: '02' },
  fields: { title: '八字段候选提取', copy: '规则基线从公告中生成公司、证券代码、报告期、营收与净利润及同比等字段候选。模型 API 接口已预留，但当前没有配置真实模型密钥，也没有发起模型请求。', status: '规则基线可用', meta: '候选字段必须经审核 · API 默认关闭', index: '03' },
  evidence: { title: '字段证据与风险检查', copy: '为候选值关联原文片段和页码，并检查缺失、单位和关键标识风险。未找到原因字段证据时保留缺失，不自动补写。', status: '已接入', meta: '保留原文证据 · 不依据常识补全', index: '04' },
  draft: { title: '生成快讯草稿', copy: '将候选字段按财经快讯模板组织成草稿，并把引用依据一同保存。草稿用于后续人工审核，不能作为已发布新闻。', status: '已接入', meta: '模板生成 · 发布前需审核', index: '05' },
  sync: { title: '飞书结果写回', copy: '将运行记录、候选字段、证据和草稿写回飞书多维表格，并按运行编号进行幂等检查。当前演示链接指向已授权工作区。', status: '已验证', meta: '实际写回成功 · 需飞书账号访问', index: '06' },
  review: { title: '人工审核与修订', copy: '审核人员逐项确认候选字段、证据和草稿；可以修订或退回。已有审核入口，但当前人工评测记录为 0，不能展示为已完成批量审核。', status: '流程已接入', meta: '待积累人工审核记录', index: '07' },
  eval: { title: '质量评分与评测汇总', copy: '开发样本有候选辅助一致性诊断；当前展示的 24/24 是已检查样本上的字段值一致情况，不是盲测准确率。独立测试集尚未运行，评分记录尚未积累。', status: '基础诊断可见', meta: '测试集保持隔离 · 不展示虚构分数', index: '08' }
};

const stepButtons = [...document.querySelectorAll('[data-step]')];
const stepTitle = document.querySelector('#step-title');
const stepCopy = document.querySelector('#step-copy');
const stepStatus = document.querySelector('#step-status');
const stepMeta = document.querySelector('#step-meta');
const stepIndex = document.querySelector('.step-detail-index > span');

stepButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const item = workflow[button.dataset.step];
    if (!item) return;
    stepButtons.forEach((node) => {
      const selected = node === button;
      node.classList.toggle('selected', selected);
      node.setAttribute('aria-selected', String(selected));
    });
    stepTitle.textContent = item.title;
    stepCopy.textContent = item.copy;
    stepStatus.textContent = item.status;
    stepMeta.textContent = item.meta;
    stepIndex.textContent = item.index;
  });
});

const navLinks = [...document.querySelectorAll('.nav-link[href^="#"]')];
const sections = navLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
if ('IntersectionObserver' in window && sections.length) {
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${visible.target.id}`));
  }, { rootMargin: '-22% 0px -62% 0px', threshold: [0, 0.15, 0.4] });
  sections.forEach((section) => observer.observe(section));
}

document.querySelectorAll('[data-current-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
