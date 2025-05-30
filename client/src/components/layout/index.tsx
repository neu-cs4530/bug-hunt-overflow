import './index.css';
import { Outlet } from 'react-router-dom';
import SideBarNav from '../main/sideBarNav';
import Header from '../header';

/**
 * Main component represents the layout of the main page, including a sidebar and the main content area.
 */
const Layout = () => (
  <div style={{ overflow: 'hidden' }}>
    <Header />
    <div id='main' className='main'>
      <SideBarNav />
      <div id='right_main' className='right_main'>
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;
