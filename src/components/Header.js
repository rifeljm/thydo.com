import React from 'react';
import { gSvg, cogSvg, signOutSvg } from '../common/utils.js';
import { observer } from 'mobx-react-lite';

import { useStore } from './Store.js';
import { _tr } from '../common/utils.js';

import css from '../css/Header.css';

function Header() {
  const { store, actions } = useStore();

  function dropdownAction(action) {
    store.showUserDropdown = false;
    if (action === 'logout') {
      document.cookie = 'thydo_user=; expires=-999999999';
      document.location = '/';
    }
  }

  function renderActions() {
    const actions = [
      {
        action: 'settings',
        name: 'Settings',
        icon: cogSvg,
      },
      {
        action: 'logout',
        name: 'Sign out',
        icon: signOutSvg,
      },
    ];
    return actions.map(elem => {
      return (
        <css.DropdownElement key={elem.action} onClick={() => dropdownAction(elem.action)}>
          <css.DropdownSvg dangerouslySetInnerHTML={{ __html: elem.icon }} />
          <css.DropdownText>{_tr(elem.name)}</css.DropdownText>
        </css.DropdownElement>
      );
    });
  }

  function renderDropdown() {
    if (!store.showUserDropdown) return null;
    return <css.accountDropdownModal>{renderActions()}</css.accountDropdownModal>;
  }

  function googleSsoClick(e) {
    e.stopPropagation();
    store.showUserDropdown = !store.showUserDropdown;
  }

  function renderGoogleSSO() {
    if (window.app.user) {
      const user = window.app.user;
      return (
        <React.Fragment>
          {renderDropdown()}
          <css.GoogleSSO>
            <css.GoogleNameEmail onClick={googleSsoClick}>
              <css.GoogleName>{user.display_name}</css.GoogleName>
              <css.GoogleEmail>{user.email}</css.GoogleEmail>
            </css.GoogleNameEmail>
            <css.GoogleAvatar src={user.avatar} onClick={googleSsoClick} />
          </css.GoogleSSO>
        </React.Fragment>
      );
    }
    return (
      <css.ButtonGoogle href={window.app.googleSSO} onClick={actions.googleSSO}>
        <css.googleSsoSvg dangerouslySetInnerHTML={{ __html: gSvg }} />
        <css.googleSsoText>{_tr('Connect')}</css.googleSsoText>
      </css.ButtonGoogle>
    );
  }

  return (
    <css.HeaderWrapper>
      <css.DayDistance className="header-distance" />
      <css.ButtonToday onClick={actions.scrollToToday}>{_tr('Today')}</css.ButtonToday>
      {renderGoogleSSO()}
    </css.HeaderWrapper>
  );
}

export default observer(Header);
