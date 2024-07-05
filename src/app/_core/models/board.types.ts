export interface BoardConfiguration{
    id: number;
    name: string;
    nameShort: string;
}

export interface BoardConfigurationResponse{
    configuration: BoardConfiguration[];
}