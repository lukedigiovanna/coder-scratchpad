import { createClient } from "@supabase/supabase-js";
import { ProgrammingLanguage, Scratch, User } from "./models";
import { setCookie, getCookie } from "typescript-cookie";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    throw Error("Supabase URL not found in environment");
}

if (!supabaseAnonKey) {
    throw Error("Supabase Anon Key not found in environment");
}

console.log(supabaseUrl, supabaseAnonKey);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function getScratches(): Promise<Scratch[]> {
    const scratchesRequest = await supabase.from("scratches").select("*");
    const scratches: Scratch[] = [];
    if (scratchesRequest.data) {
        for (const scratchRawData of scratchesRequest.data) {
            const scratch: Scratch = {
                title: scratchRawData.title,
                code: scratchRawData.code,
                language: scratchRawData.language as ProgrammingLanguage,
                createdAt: new Date(scratchRawData.created_at),
                updatedAt: new Date(scratchRawData.updated_at),
            };
            scratches.push(scratch);
        }
    }
    return scratches;
}

async function makeUser(email: string): Promise<User> {
    // Fetch all scratches
    const scratches = await getScratches();

    const user: User = {
        email,
        scratches,
    };

    return user;
}

async function signInWithPassword(email: string, password: string): Promise<User | null> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        throw Error(error.message);
    }
    
    // Save cookie of refresh token for possible later use
    setCookie("refresh_token", data.session.refresh_token, {
        sameSite: "Strict",
        secure: true,
    });
    setCookie("access_token", data.session.access_token, {
        sameSite: "Strict",
        secure: true,
    });
    
    return makeUser(email);
}

async function attemptToRestoreSession(): Promise<User | null> {
    // Read the refresh_token cookie
    const refreshToken = getCookie("refresh_token");
    const accessToken = getCookie("access_token");
    if (refreshToken && accessToken) {
        const {data, error} = await supabase.auth.setSession({
            refresh_token: refreshToken,
            access_token: accessToken,
        });

        if (error) {
            throw Error(error.message);
        }
        
        console.log(data);

        return makeUser(data.user?.email as string);
    }
    return null;
}

export { supabase, signInWithPassword, attemptToRestoreSession };