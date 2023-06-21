import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from '@mui/material/Stack';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

import { SavedProfileResponse } from "../../../models/profile.model";
import { DefaultURLs } from "../../../constants/defaults.constants";

export interface ProfilePageInfo {
    name: string;
    email: string;
    gender: string;
    phone: string;
    largePicture: string;
    date: string;
    age: number;
    street: { number: number, name: string }; 
    city: string;
    state: string;
}

const ProfilePage = (): JSX.Element => {
    const navigate = useNavigate();
    const { state } = useLocation();
    
    // Sould be changed with MOBX
    const [newName, setNewName] = useState<string | undefined>();
    const [currentProfile, setCurrentProfile] = useState<ProfilePageInfo>();

    useEffect(() => {
        const profile = state.profile as SavedProfileResponse;
        const profileInfo = castToProfilePageInfo(profile);

        setCurrentProfile(profileInfo);
        setNewName(profileInfo.name);
    }, [])

    const castToProfilePageInfo = (profile: SavedProfileResponse): ProfilePageInfo => {
        const _profile: SavedProfileResponse = profile as SavedProfileResponse;
        return {
            name: _profile.name,
            gender: _profile.gender,
            email: _profile.email,
            largePicture: _profile.picture.large,
            phone: _profile.phone,
            date: _profile.dob.date,
            age: _profile.dob.age,
            street: { number: _profile.address.street.number, name: _profile.address.street.name },
            city: _profile.address.city,
            state: _profile.address.state
        }
    }

    const backPage = () => {
		navigate(-1);
	}

    const saveProfile = async () => {
        const response = await fetch(`${DefaultURLs.BackendService}/users`, {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...state.profile, name: newName
            })
        });

        if (response.status === 200) {
            alert('Saved successfully');
        } else {
            console.error('error saving profile:', response);
        }
    }

    const updateProfile = async () => {
        const response = await fetch(`${DefaultURLs.BackendService}/users/${/*encodeURIComponent(*/state.profile.email/*)*/}`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...state, name: newName
            })
        });

        if (response.status === 201) {
            alert('Updated successfully');
        } else {
            console.error('error update profile:', response);
        }
    }

    const deleteProfile = async () => {
        const response = await fetch(`${DefaultURLs.BackendService}/users/${encodeURIComponent(state.profile.email)}`, {
            method: 'DELETE'
        });

        if (response.status === 200) {
            alert('Deleted successfully');
        } else {
            console.error('error deleting profile:', response);
        }
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <IconButton onClick={backPage}>
                        <ArrowBackIcon htmlColor={'white'} />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Profile
                    </Typography>
                </Toolbar>
            </AppBar>
            <Stack>
                <Grid container direction={'column'}>
                    <Grid item>
                        <Avatar
                            src={currentProfile?.largePicture}
                            sx={{ width: 300, height: 300 }}
                        />
                    </Grid>
                    
                    <Grid container direction={'row'}>
                        <Typography>Details</Typography>
                        <Grid item>
                            <TextField 
                                required 
                                value={newName} 
                                label="name" 
                                onChange={(changeEvent) => setNewName(changeEvent.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <TextField 
                                id="outlined-read-only-input"
                                label="Gender"
                                value={currentProfile?.gender}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="Age"
                                value={currentProfile?.age}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="Date"
                                value={currentProfile?.date}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'}>
                        <Typography>Contact</Typography>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="Email"
                                value={`${currentProfile?.email}`}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="Phone"
                                value={`${currentProfile?.phone}`}
                                disabled
                            />
                        </Grid>
                    </Grid>
                    <Grid container direction={'row'}>
                        <Grid item>
                            <Typography>Address</Typography>
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="Street"
                                value={`${currentProfile?.street.number} ${currentProfile?.street.name}`}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="City"
                                value={`${currentProfile?.city}`}
                                disabled
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                id="outlined-read-only-input"
                                label="State"
                                value={`${currentProfile?.state}`}
                                disabled
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <br />
                <footer>
                    <Box>
                        <Grid container spacing={2} justifyContent="center">
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    startIcon={<SaveIcon />} 
                                    onClick={saveProfile}
                                >
                                    Save
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained"
                                    startIcon={<EditIcon />} 
                                    onClick={updateProfile}
                                >
                                    Update
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button 
                                    variant="contained" 
                                    startIcon={<DeleteIcon />} 
                                    onClick={deleteProfile}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </footer>
            </Stack>
        </>
    );
}

export default ProfilePage;