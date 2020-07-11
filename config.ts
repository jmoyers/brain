import { join, resolve } from "path";

export const brainDir = join(resolve("./"), ".brain");
export const brainFile = join(brainDir, "brain");
export const infoFile = join(brainDir, "info");
