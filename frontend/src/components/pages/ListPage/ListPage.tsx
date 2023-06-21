import { useEffect, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid } from '@mui/material';
import { useNavigate } from "react-router-dom";

import { DefaultRoutes, DefaultURLs } from '../../../constants/defaults.constants';
import { RandomProfileResponse, SavedProfileResponse } from '../../../models/profile.model';

export interface ListPageProps {
    showHistory?: boolean;
}

interface ProfileItem {
    thumbnail: string;
    name: string;
    gender: string;
    country: string;
    phoneNumber: string;
    email: string;
}

const ListPage = (props: ListPageProps): JSX.Element => {
    const navigate = useNavigate();

    // TODO: Change this to MOBX
    const [profiles, setProfiles] = useState<RandomProfileResponse[] | SavedProfileResponse[] | undefined>();

    useEffect(() => {
        props?.showHistory ? loadDataFromHistory() : loadRandomData();
    }, [])

    const navigateToProfile = (profile: SavedProfileResponse) => {
        navigate(DefaultRoutes.Profile, { state: { profile } });
    }

    const loadRandomData = async (): Promise<void> => {
        const response = await fetch(`${DefaultURLs.RandomUserService}/?format=json&results=10`);
        const body = await response.json();

        const randomProfiles: RandomProfileResponse[] = body.results;
        console.log('randomProfiles:', randomProfiles);

        setProfiles(randomProfiles);
    }

    const loadDataFromHistory = async (): Promise<void> => {
        const response = await fetch(`${DefaultURLs.BackendService}/users`);
        const body = await response.json();

        const savedProfiles: SavedProfileResponse[] = body.users;
        console.log('savedProfiles:', savedProfiles);

        setProfiles(savedProfiles);
    }

    const toSavedProfileResponse = (profile: RandomProfileResponse | SavedProfileResponse): SavedProfileResponse => {
        if (!(profile as RandomProfileResponse).login) {
            return profile as SavedProfileResponse;
        }

        const _profile: RandomProfileResponse = profile as RandomProfileResponse;
        return {
            name: `${_profile.name.title} ${_profile.name.first} ${_profile.name.last}`,
            gender: _profile.gender,
            email: _profile.email,
            phone: _profile.phone,
            dob: _profile.dob,
            picture: {
                large: _profile.picture.large,
                thumbnail: _profile.picture.thumbnail
            },
            address: {
                street: _profile.location.street,
                city: _profile.location.city,
                state: _profile.location.state,
                country: _profile.location.country
            }
        }
    }

    const renderItems = (): JSX.Element[] | undefined => {
        if (!profiles) 
            return;
        
        return profiles.map((profile: RandomProfileResponse | SavedProfileResponse) => {
            profile = toSavedProfileResponse(profile);
            const item: ProfileItem = {
                name: profile.name,
                thumbnail: profile.picture.thumbnail,
                country: profile.address.country,
                email: profile.email,
                gender: profile.gender,
                phoneNumber: profile.phone
            }

            return (
                <>
                    <ListItem key={item.email} alignItems="flex-start" onClick={() => navigateToProfile(profile as SavedProfileResponse)}>
                        <ListItemAvatar key={`${item.email}avatar`}>
                            <Avatar alt={item.name} src={item.thumbnail} />
                        </ListItemAvatar>
                        <ListItemText
                            key={`${item.email}Item`}
                            primary={item.name}
                            secondary={
                                <>
                                    {`${item.country} ${item.gender}`} <br />
                                    
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        {item.phoneNumber} <br />
                                        {item.email}
                                    </Typography>
                                </>
                            }
                        />
                    </ListItem>
                    <Divider variant="inset" component="li" />
                </>
            )
        });
    }
    
    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ minHeight: '100vh' }}
        >
            <List>
                { renderItems() || 'No content' }
            </List>
        </Grid>
    );
}

export default ListPage;