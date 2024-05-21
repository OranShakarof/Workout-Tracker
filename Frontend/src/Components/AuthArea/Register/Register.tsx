import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Avatar, Button, Grid, IconButton, InputAdornment, TextField, Typography } from "@mui/material";
import { useState } from 'react';
import { useForm } from "react-hook-form";
import { NavLink, useNavigate } from "react-router-dom";
import UserModel from "../../../Models/UserModel";
import authService from '../../../Services/AuthService';
import notifyService from '../../../Services/NotifyService';
import "./Register.css";

function Register(): JSX.Element {
    const [showPassword,setShowPassword] = useState<Boolean>(false);
    const {register,handleSubmit, formState: {errors}, trigger } = useForm<UserModel>();
    const navigate = useNavigate();

    async function send(user: UserModel){
        try{
            await authService.register(user);
            notifyService.success("You have been registered successfully!");
            navigate("/profile/new");
        }
        catch(err: any){
            notifyService.error(err);
        }
        
    }

    return (
        <div className="Register">
        <form onSubmit={handleSubmit(send)}>
    
            <div className="HeaderBox">
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon/>
                </Avatar>
            </div>
    
            <Typography component="h1" variant="h5" sx={{mb:3}} textAlign={"center"}>
                Sign up
            </Typography>
    
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="First Name"
    
                        inputProps={{ maxLength: 20 }}
                        {...register("firstName",{
                            required: "* First name is required!",
                            minLength: {
                                value: 2,
                                message: "* Minimum 2 chars"
                            },
                            maxLength: {
                                value: 20,
                                message: "* Less than 20 chars!"
                            }
                        })}
                        onBlur={() => trigger("firstName")}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />
                </Grid>
    
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Last Name"
                        inputProps={{ maxLength: 20 }}
    
                        {...register("lastName",{
                            required: "* Last name is required!",
                            minLength: {
                                value: 2,
                                message: "* Minimum 2 chars"
                            },
                            maxLength: {
                                value: 20,
                                message: "Last name need to be less than 20 chars!"
                            }
                        })}
                        onBlur={() => trigger("lastName")}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
                </Grid>
    
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        type="email"
                        label="Email Address"
    
                        inputProps={{ maxLength: 50 }}
                        {...register("email",{
                                required: "* Email is required!",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i,
                                    message: "* Invalid Email Format"
                                }
                            })}
                            onBlur={() => trigger("email")}
                            error={!!errors.email}
                            helperText={errors.email?.message}
                    />
                </Grid>
    
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Password"
                        type={!showPassword ? "password" : "text"}
    
                        InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)}>
                                  {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
    
                        {...register("password",{
                            required: "* Password is required!",
                            minLength: {
                                value: 4,
                                message: "Password need to be more than 4 chars!"
                            },
                            maxLength: {
                                value: 100,
                                message: "Last name need to be less than 100 chars!"
                            }
                        })}
                        onBlur={() => trigger("password")}   
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                </Grid>
            </Grid>
    
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            >
                Sign Up
            </Button>
    
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <NavLink to="/Login">
                        <Button className={"BtnHover"} sx={{ textTransform: 'none'}}>Already have an account? Sign in</Button>
                    </NavLink>
                </Grid>
            </Grid>
        </form>
    </div>
      );
    }

export default Register;
