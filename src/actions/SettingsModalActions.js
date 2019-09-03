export const saveSettings = store => settings => {
  store.settings.language = settings.language.value;
  store.settings.firstDayInWeek = settings.firstDayInWeek === 0 ? 'sunday' : 'monday';
  store.showSettingsModal = false;
  dayjs.locale(settings.language.value);
  scrollToToday(store)(true);
  axios.put('/api/settings', { settings: store.settings }).then(() => {
    /* todo: implement response actions */
  });
};
