export const listItem = (props) => {

    const selectedState = (props.selectedUser && props.selectedUser.uid === props.user.uid) ? {
        backgroundColor: `${props.theme.backgroundColor.primary}`
    } : {};

    return {
        display: "flex",
        flexDirection: "row",
        justifyContent: "left",
        alignItems: "center",
        cursor: "pointer",
        width: "100%",
        padding: "10px 20px",
        ...selectedState,
        '&:hover': {
            backgroundColor: `${props.theme.backgroundColor.primary}`,
            color: "#fff"
        }
    }
}

export const itemThumbnailStyle = () => {
    
    return {
        display: "inline-block",
        width: "36px",
        height: "36px",
        flexShrink: "0"
    }
}

export const itemDetailStyle = () => {
    
    return {
        width: "calc(100% - 45px)",
        flexGrow: 1,
        paddingLeft: "15px"
    }
}

export const itemNameStyle = () => { 
    
    return {
        fontSize: "15px",
        fontWeight: "600",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        width: "100%",
        margin: "5px 0 0 0",
        '&:hover, &:active': {
            color: "#fff"
        }
    }
};

export const itemDescStyle = (theme) => { 
    return {
        marginTop: "10px",
        borderBottom: `1px solid ${theme.borderColor.primary}` 
    }
};

