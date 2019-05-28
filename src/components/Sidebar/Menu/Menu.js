// @flow
import React from 'react';
import { Link } from 'gatsby';
import styles from './Menu.module.scss';

type Props = {
  menu: {
    label: string,
    path: string
  }[]
};

const Menu = ({ menu }) => {
  const getLink = (item) => {
    const { label, path } = item;
    const className = styles['menu__list-item-link'];
    const activeClassName = styles['menu__list-item-link--active']

    if (!path.includes("https://") && !path.includes("http://")) {
      return (
        <Link
          to={ path }
          className={ className }
          activeClassName={ activeClassName }
        >
          { label }
        </Link>
      );
    }

    return (
      <a
        className={ className }
        activeClassName={ activeClassName }
        style={{
          textDecoration: "none"
        }}
        href={ path }
        target="_blank"
      >
        { label }
      </a>
    );
  }
  return (
    <nav className={styles['menu']}>
      <ul className={styles['menu__list']}>
        {menu.map((item) => (
          <li className={styles['menu__list-item']} key={item.path}>
            { getLink(item) }
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Menu;
