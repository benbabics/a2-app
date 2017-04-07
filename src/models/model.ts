export abstract class Model<DetailsT> {

  public details: DetailsT;

  public constructor(details?: DetailsT) {
    this.details = details || {} as DetailsT;
  }
}
