const launchOptionForFC = [
  // error when launch(); No usable sandbox! Update your kernel
  "--no-sandbox",
  // error when launch(); Failed to load libosmesa.so
  "--disable-gpu",
  // freeze when newPage()
  // '--single-process',
  "--proxy-server='direct://'",
  "--proxy-bypass-list=*",
  "--allow-file-access-from-files",
  "--disable-setuid-sandbox",
  "--no-first-run",
  "--no-zygote",
];

module.exports = {
    launchOptionForFC
};