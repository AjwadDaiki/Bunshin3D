const fs = require('fs');
const en = JSON.parse(fs.readFileSync('./messages/en.json', 'utf8'));

function getKey(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length; i++) {
    if (cur === null || cur === undefined || typeof cur !== 'object') return undefined;
    cur = cur[parts[i]];
  }
  return cur;
}

const missing = [
  'Common.creditsWithCount',
  'Common.errors.noModelUrl',
  'Common.errors.downloadFailed',
  'Common.errors.unknownFormat',
  'Studio.Header.titleDot',
  'Studio.Logs.missingImage',
  'Studio.Logs.missingPrompt',
  'Studio.Logs.generationFailed',
  'Studio.Logs.downloadSuccess',
  'Studio.Logs.downloadError',
  'Studio.Interface.DropZone.previewAlt',
  'Studio.Interface.Export.readyTitle',
  'Studio.Interface.Export.subtitle',
  'Studio.Interface.Export.labels.glb',
  'Studio.Interface.Export.labels.web',
  'Studio.Interface.Export.labels.obj',
  'Studio.Interface.Export.labels.universal',
  'Studio.Interface.Export.labels.usdz',
  'Studio.Interface.Export.labels.ar',
  'Studio.Interface.Export.labels.stl',
  'Studio.Interface.Export.labels.print',
  'Studio.Interface.Viewer.creatingMagic',
  'Studio.Interface.Viewer.referenceImage',
  'Auth.tryDifferentEmail',
  'Auth.Errors.noCode',
  'Auth.Errors.noSession',
  'Auth.Errors.banned',
  'Auth.Errors.generic',
  'Auth.Errors.magicLinkSend',
  'Auth.Errors.googleLogin',
  'Account.History.confirmDelete',
  'Account.History.retentionNotice',
  'Account.History.statuses.processing',
  'Account.History.statuses.succeeded',
  'Account.History.statuses.failed',
  'Account.History.statuses.queued',
  'Account.History.sourceAlt',
  'Admin.Errors.changeRoleFailed',
  'Admin.Errors.actionFailed',
  'Admin.Errors.grantCreditsFailed',
  'Admin.Errors.updateSystemStatus',
  'Admin.Errors.loadUsers',
  'Admin.Statuses.succeeded',
  'Admin.Statuses.failed',
  'Admin.Statuses.processing',
  'Admin.Statuses.queued',
  'Admin.Users.rolesShort.admin',
  'Admin.Users.rolesShort.moderator',
  'Admin.Users.rolesShort.user',
  'Admin.Users.unknownInitial',
  'Admin.Users.statusBanned',
  'Admin.Users.statusActive',
  'Admin.Users.customAmountPlaceholder',
  'Admin.Users.deleteKeyword',
  'Pricing.Checkout.loginRequired',
  'Pricing.Checkout.noCheckoutUrl',
  'Pricing.Checkout.checkoutErrorLog',
  'Navigation.aria.mobileNav',
  'Error.rootLogPrefix',
  'Error.warningSymbol',
];

for (const k of missing) {
  const val = getKey(en, k);
  console.log(k + ' = ' + JSON.stringify(val));
}
