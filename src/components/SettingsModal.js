import React from 'react';
import { observer } from 'mobx-react-lite';
import Select from 'react-select';
import { toJS } from 'mobx';

import { useStore } from './Store.js';
import Button from './Button.js';
import { _tr, locales } from '../common/utils.js';

import css from '../css/SettingsModal.css';

function SettingsModal() {
  const selectLanguagesRef = React.createRef();
  const { store, actions } = useStore();
  const [settings, setSettings] = React.useState({});
  const languageOptions = Object.keys(locales).map(locale => {
    return {
      value: locale,
      label: locales[locale],
    };
  });
  React.useEffect(() => {
    const language = Object.keys(locales).reduce((prev, value) => {
      const obj = {
        value,
        label: locales[value],
      };
      const lang = toJS(store.settings).language || 'en';
      return lang === value ? obj : prev;
    }, null);
    setSettings({ ...settings, language });
    const firstDayIndex = store.settings.firstDayInWeek === 'sunday' ? 0 : 1;
    document.getElementsByName('fdotw')[firstDayIndex].checked = true;
  }, []);

  function onOverlayClick() {
    store.showSettingsModal = false;
  }

  function saveSettings() {
    actions.saveSettings(settings);
  }

  function onChangeLanguageSelect(option) {
    setSettings({ ...settings, language: option });
  }

  function setFirstDayInWeek(e) {
    setSettings({ ...settings, firstDayInWeek: parseInt(e.target.id.split('_')[1], 10) });
  }

  const reactSelectStyles = {
    container: provided => {
      return {
        ...provided,
        lineHeight: '22px',
      };
    },
    control: provided => {
      return {
        ...provided,
        borderWidth: 1,
        borderColor: '#999',
        boxShadow: 0,
        minHeight: '32px',
        '&:hover': {
          borderColor: '#999',
        },
      };
    },
    dropdownIndicator: provided => {
      return {
        ...provided,
        padding: '7px',
      };
    },
  };

  return (
    <css.Modal>
      <css.Overlay onClick={onOverlayClick} />
      <css.SettingsModal>
        <css.Content>
          <css.ModalTitle>{_tr('Settings')}</css.ModalTitle>
          <css.Table>
            <css.Row>
              <css.Cell>{_tr('Language (weekday and month)')}</css.Cell>
              <css.Cell>
                <Select
                  value={settings.language}
                  styles={reactSelectStyles}
                  ref={selectLanguagesRef}
                  options={languageOptions}
                  onChange={onChangeLanguageSelect}
                />
              </css.Cell>
            </css.Row>
            <css.Row>
              <css.Cell>{_tr('First day of the week')}</css.Cell>
              <css.Cell>
                <input type="radio" name="fdotw" id="firstDay_0" onClick={setFirstDayInWeek} />
                <css.Radio htmlFor="firstDay_0">
                  <span>{_tr('Sunday')}</span>
                </css.Radio>
                <input type="radio" name="fdotw" id="firstDay_1" onClick={setFirstDayInWeek} />
                <css.Radio htmlFor="firstDay_1">
                  <span>{_tr('Monday')}</span>
                </css.Radio>
              </css.Cell>
            </css.Row>
          </css.Table>
        </css.Content>
        <css.ModalActions>
          <Button onClick={saveSettings} active float="right" title={'Save'} />
        </css.ModalActions>
      </css.SettingsModal>
    </css.Modal>
  );
}

export default observer(SettingsModal);
