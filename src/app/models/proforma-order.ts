export class ProformaOrder {

    constructor(
        public id: number,
        public company_name: string,
        public note: string,
        public validity_date: string,
        public created_at: string
    ) {}

}
