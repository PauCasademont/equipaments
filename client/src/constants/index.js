export const EMAIL_ADMIN = 'casademont13@gmail.com'

export const LABELS = ['Gener', 'Febrer', 'Març', 'Abril', 'Maig', 'Juny', 'Juliol', 'Agost', 'Setembre', 'Octubre', 'Novembre', 'Desembre'];

export const COLORS = ['#5DADE2', '#2ECC71', '#FA000A', '#FBFB4E', '#DD66F5', '#EB984E', '#48C9B0', '#5D6D7E'];

export const CONSUMPTION = 'consumption';
export const PRICE = 'price';
export const AREA = 'area';

export const CONCEPTS = ['Total', 'Gas', 'Electricitat', 'Gasoil-Biomassa'];
export const DATA_TYPES = {
    [CONSUMPTION]: 'Consum',
    [PRICE]: 'Preu',
    [AREA]: 'Superfície'
};

export const TYPOLOGIES = [
    {name:'Oficina', icon:'oficina'},
    {name:'Educació', icon:'educacio'},
    {name:'Cultural', icon:'cultural'},
    {name:'Sanitari', icon:'sanitari'},
    {name:'Esportiu', icon:'esportiu'},
    {name:'Pscina', icon:'piscina'},
    {name:'Residencial', icon:'residencial'},
    {name:'Bombeig', icon:'bombeig'},
    {name:'Altres', icon:'altres'}
];

export const USER_STORAGE = 'profile';

export const SUPERSCRIPT_TWO = '\u00B2';

export const FIRST_YEAR = 2013;
export const CURRENT_YEAR = new Date().getFullYear();
export const YEARS_LIST = Array(CURRENT_YEAR - FIRST_YEAR + 1).fill().map((_, index) => FIRST_YEAR + index); 