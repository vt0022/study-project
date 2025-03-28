import {
  HomeOutlined,
  NotificationsOutlined,
  PersonOutline,
  Timeline,
} from "@mui/icons-material";

const LeftbarItemList = [
  { name: "Home", icon: HomeOutlined, path: "/home" },
  {
    name: "Notifications",
    icon: NotificationsOutlined,
    path: "/notifications",
  },
  { name: "Wall", icon: Timeline, path: "/wall" },
  { name: "Profile", icon: PersonOutline, path: "/profile" },
];

export { LeftbarItemList };
