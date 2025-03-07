
export function opt(xp) {
    if (xp < 1000) {
        return xp + " Bytes";
    }
    let mbs = xp / 1000;
    if (mbs < 1000) {
        return mbs.toFixed(2) + " KBs";
    }
    let gbs = mbs / 1000;
    if (gbs < 1000) {
        return gbs.toFixed(2) + " MBs";
    }
    let tbs = gbs / 1000;
    return tbs.toFixed(2) + " GBs";
}

export function calculateAge(dob) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--; // Adjust if the birthday hasn't occurred yet this year
    }

    return age;
}

export function getDay(date) {
    return new Date(date).toLocaleDateString("en-US", {
        weekday: "short", // e.g., Mon
        month: "short", // e.g., Jan
        day: "2-digit", // e.g., 01
        year: "numeric", // e.g., 2024
    });
}