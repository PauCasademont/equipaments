//This file contains all constant variables of client side

export const EMAIL_ADMIN = 'catedragironasmartcity@udg.edu'

export const MONTHS = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

export const COLORS = ['#5DADE2', '#2ECC71', '#FA000A', '#FBFB4E', '#DD66F5', '#EB984E', '#48C9B0', '#5D6D7E'];

export const CONSUMPTION = 'consumption';
export const PRICE = 'price';
export const AREA = 'area';
export const COORDINATES = 'coordinates';
export const TYPOLOGY = 'typology';


export const CONCEPTS = ['Total', 'Electricitat', 'Gasoil_Biomassa', 'Gas' ];
export const DATA_TYPES = {
    [CONSUMPTION]: 'Consum',
    [PRICE]: 'Preu',
    [AREA]: 'Superfície',
    [COORDINATES]: 'Coordenades',
    [TYPOLOGY]: 'Tipologia'
};

export const TYPOLOGIES = [
    {screenName:'Oficina', name:'oficina'},
    {screenName:'Educació', name:'educacio'},
    {screenName:'Cultural', name:'cultural'},
    {screenName:'Sanitari', name:'sanitari'},
    {screenName:'Esportiu', name:'esportiu'},
    {screenName:'Pscina', name:'piscina'},
    {screenName:'Residencial', name:'residencial'},
    {screenName:'Bombeig', name:'bombeig'},
    {screenName:'Altres', name:'altres'}
];

export const USER_STORAGE = 'profile';

export const SUPERSCRIPT_TWO = '\u00B2';

export const FIRST_YEAR = 2013;
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS_LIST = Array(CURRENT_YEAR - FIRST_YEAR + 1).fill().map((_, index) => FIRST_YEAR + index); 