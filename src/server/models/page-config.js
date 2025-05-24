import mongoose from 'mongoose';

const pageConfigSchema = new mongoose.Schema({
  isDev: Boolean,
  showHeader: Boolean,
  showContent: Boolean,
  showFooter: Boolean,
  pageJS: String,
  pageCSS: String,
  pageHTML: String,
});

export default mongoose.model('pageConfig', pageConfigSchema);
