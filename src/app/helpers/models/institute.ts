export class Institute {
    private _instituteId: string;
    private _instituteDetail: any;

    get instituteId(): string {
        return this._instituteId;
    }

    get instituteDetail(): any {
        return this._instituteDetail;
    }

    saveInstituteData(data) {
        if (data.instituteID) {
            this._instituteId = data.instituteID;
        }
        this._instituteDetail = data;
    }
}
