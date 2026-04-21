import React, { useState } from 'react';
import { Menu, MenuItem } from '@mui/material';
import { Avatar } from './avatar';
import { useNavigate } from 'react-router-dom';
import { LogoutComponent } from './logoutComponent';
import { EVariantLogout } from '../types/User';
import { CustomLoader } from './customLoader';
import { useQuery } from '@tanstack/react-query';
import { currentUserQuery } from '../reactQuery/userQuery';

export const DropdownMenu: React.FC = () => {
  const { data: currentUser, isLoading } = useQuery(currentUserQuery);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget); 
  };

  const handleClose = () => {
    setAnchorEl(null); 
  };

  const handleProfileClick = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLogout = async() => {
    handleClose(); 
  };

      if (isLoading) {
        <CustomLoader loaderSize={30} paddingY={50}/>
      }

  return (
    <div>
      <div className="flex items-center" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <Avatar size={40} source={currentUser?.avatar || 'https://i.imgur.com/aX3x1wT.png'} altText='avatar'/>
        <p className="text-slate-200 ml-2 text-sm">{currentUser?.name}</p>
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ marginTop: '30px' }}
      >
        <MenuItem onClick={handleProfileClick} style={{paddingInline: "35px"}}>Profile</MenuItem>
        <MenuItem onClick={handleClose} style={{paddingInline: "35px"}}>Settings</MenuItem>
        <LogoutComponent variant={EVariantLogout.Menu} handleClick={handleLogout}/>
      </Menu>
    </div>
  );
};

