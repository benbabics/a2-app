export abstract class Model<DetailsT> {

    constructor(details: DetailsT) {
        //copy fields from the details to the model
        for (let propertyName in details) {
            (<any>this)[propertyName] = details[propertyName];
        }
    }
}
