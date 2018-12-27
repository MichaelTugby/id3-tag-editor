export interface ITag extends IWriteableTag {
    bitrate: number;
    channels: number;
    codec: string;
    filename: string;
    length: number;
    path: string;
    samplerate: number;
    time: string;
    track: number;
}

export interface IWriteableTag {
    album: string;
    albumartist: string;
    artist: string;
    compilation: string;
    discnumber: string;
    genre: string;
    pictures: ITagPicture[];
    title: string;
    tracknumber: string;
    year: number;
}

export interface ITagPicture {
    mimetype: string;
    picture: Uint8Array;
}
