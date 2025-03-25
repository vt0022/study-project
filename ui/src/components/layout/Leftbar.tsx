import { Box, Button, List } from "@mui/material";
import Logo from "@/assets/images/logo.webp";
import { LeftbarItemList } from "../sidebar/ItemList";
import Item from "../sidebar/Item";
import authService from "@/services/authService";
import { useDispatch } from "react-redux";
import { removeUser } from "@/redux/slices/userSlice";
import { useNavigate } from "react-router-dom";
import postService from "@/services/postService";
import { usePrivateAxios } from "@/hooks/usePrivateAxios";

function Leftbar() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    usePrivateAxios();

    const onLogout = async () => {
        await authService.logout();
        dispatch(removeUser());
        navigate("/login");
    };

    const onTest = async () => {
        const response = await postService.test();
    };

    return (
        <Box sx={{ height: "100vh", boxSizing: "border-box" }}>
            <Box
                sx={{
                    width: "300px",
                    p: "50px",
                    position: "fixed",
                    backgroundColor: "white",
                    height: "100%",
                }}>
                <img src={Logo} alt="Logo" width="100" height="100" style={{ margin: "0 auto" }} />

                <List>
                    {LeftbarItemList.map((item, key) => {
                        return <Item key={key} name={item.name} icon={item.icon} path={item.path} />;
                    })}
                </List>

                <Button variant="contained" color="info" onClick={onLogout}>
                    Log out
                </Button>

                {/* <Button variant="contained" color="primary" onClick={onTest}>
                    Test
                </Button> */}
            </Box>
        </Box>
    );
}

export default Leftbar;
