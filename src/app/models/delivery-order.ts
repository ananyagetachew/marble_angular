export class DeliveryOrder {

    constructor(
        public id: number,
        public company_name: string,
        public note: string,
        public sent_to_production: string,
    ) { }

}
