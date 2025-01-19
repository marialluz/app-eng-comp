import AnnouncementIcon from "@mui/icons-material/Announcement";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import { Button, Drawer } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from '../stores/user';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const { is_student, is_teacher } = useUserStore();

  const getMenuItems = () => {
    const commonItems = [
      { text: "Notícias", icon: <AnnouncementIcon />, path: "/posts" },
      { text: "Grade Curricular", icon: <CalendarTodayIcon />, path: "/curriculum" },
    ];

    if (is_student) {
      return [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/student" },
        { text: "Materiais", icon: <FolderIcon />, path: "/materials" },
        ...commonItems,
      ];
    }

    if (is_teacher) {
      return [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard/teacher" },
        ...commonItems,
      ];
    }

    return commonItems;
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      {getMenuItems().map((item) => (
        <Button
          key={item.text}
          startIcon={item.icon}
          fullWidth
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            py: 2,
            px: 3,
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.08)",
            },
          }}
          onClick={() => handleNavigate(item.path)}
        >
          {item.text}
        </Button>
      ))}
    </Drawer>
  );
};

export default Sidebar;