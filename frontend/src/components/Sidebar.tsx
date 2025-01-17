import AnnouncementIcon from "@mui/icons-material/Announcement";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import { Button, Drawer } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom"; // Importando o useNavigate

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
    { text: "Materiais", icon: <FolderIcon />, path: "/materials" },
    { text: "Prof", icon: <FolderIcon />, path: "/dashboard/teacher" },
    { text: "Aluno", icon: <FolderIcon />, path: "/dashboard/student" },
    { text: "Grade Curricular", icon: <CalendarTodayIcon />, path: "/curriculum" },
    { text: "Notícias", icon: <AnnouncementIcon />, path: "/news" },
  ];

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      {menuItems.map((item) => (
        <Button
          key={item.text}
          startIcon={item.icon}
          sx={{
            justifyContent: "flex-start",
            textAlign: "left",
            py: 2,
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
