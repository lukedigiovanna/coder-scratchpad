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

function rawDataToScratch(data: any): Scratch {
    return {
        id: data.id,
        title: data.title,
        code: data.code,
        language: data.language as ProgrammingLanguage,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
    };
}

async function getScratches(): Promise<Scratch[]> {
    const scratchesRequest = await supabase.from("scratches").select("*");
    const scratches: Scratch[] = [];
    if (scratchesRequest.data) {
        for (const scratchRawData of scratchesRequest.data) {
            scratches.push(rawDataToScratch(scratchRawData));
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

async function insertScratch(scratch: Scratch): Promise<Scratch> {
    if (scratch.id !== null) {
        throw Error("ID of scratch should be null")
    }

    return scratch;
}

// Attempts to overwrite the data of this scratch
// Returns the copy of the updated scratch on success. Otherwise throws an
// error.
async function updateScratch(scratch: Scratch, updateTime=false): Promise<Scratch> {
    if (scratch.id === null) {
        throw Error("Cannot update scratch that has no ID");
    }

    const now = updateTime ? new Date() : scratch.updatedAt;
    const update = await supabase.from("scratches").update({
        title: scratch.title,
        code: scratch.code,
        updated_at: now,
        language: scratch.language,    
    }).eq("id", scratch.id).select();

    if (!update.data || update.data.length === 0) {
        throw Error("Did not update anything");
    }

    return rawDataToScratch(update.data[0]);
}



export { supabase, signInWithPassword, attemptToRestoreSession, updateScratch };