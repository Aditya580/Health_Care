import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Field, FieldDescription, FieldGroup, FieldLabel} from "@/components/ui/field";
import {Input} from "@/components/ui/input";
import {useState} from "react";
import {signInWithGoogle} from "../authentication/googleLogin.js";
import { handleSignup } from "@/authentication/handleSignUp.js";

export function SignupForm({className, onSwitch, ...props}) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleGoogle() {
        await signInWithGoogle();
    }

    async function submit(e) {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) return alert("All fields are required");

        if (password !== confirmPassword) return alert("Passwords do not match");

        if (password.length < 6) return alert("Password must be at least 8 characters");

        await handleSignup(name, email, password);
    }

    return (
        <Card {...props}>
            <CardHeader>
                <CardTitle>Create an account</CardTitle>
                <CardDescription>Enter your information below to create your account</CardDescription>
            </CardHeader>

            <CardContent>
                <form onSubmit={submit}>
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="name">Full Name</FieldLabel>
                            <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e)=>{setName(e.target.value)}} />
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">Password</FieldLabel>
                            <Input
                                id="password"
                                type="password"
                                required
                                value= {password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <FieldDescription>Must be at least 8 characters long.</FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="confirm-password">Confirm Password</FieldLabel>
                            <Input
                                id="confirm-password"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <FieldDescription>Please confirm your password.</FieldDescription>
                        </Field>

                        <Field>
                            <Button type="submit" className="cursor-pointer">
                                Create Account
                            </Button>
                            <Button variant="outline" type="button" className="cursor-pointer" onClick={handleGoogle}>
                                Sign up with Google
                            </Button>

                            <FieldDescription className="px-6 text-center">
                                Already have an account?{" "}
                                <button type="button" className="underline cursor-pointer" onClick={onSwitch}>
                                    Sign in
                                </button>
                            </FieldDescription>
                        </Field>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    );
}
