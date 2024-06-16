import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import StarBorder from '@mui/icons-material/StarBorder';
import { styled } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 360,
  backgroundColor: theme.palette.background.paper,
}));

const NestedListItem = styled(ListItem)(({ theme }) => ({
  paddingLeft: theme.spacing(4),
}));

export default function AccountManagement() {
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Root>
      <List component="nav" aria-labelledby="nested-list-subheader">
        <ButtonBase onClick={handleClick}>
          <ListItem>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Accountverwaltung" />
            {open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
        </ButtonBase>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ButtonBase>
              <NestedListItem>
                <ListItemIcon>
                  <StarBorder />
                </ListItemIcon>
                <ListItemText primary="Buchungsprofil" />
              </NestedListItem>
            </ButtonBase>
            {/* Fügen Sie hier weitere Listenelemente hinzu */}
          </List>
        </Collapse>
      </List>
    </Root>
  );
}
