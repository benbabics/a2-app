import "reflect-metadata";

import { ModelGeneratorsModule } from "@angular-wex/models/mocks";

export function bootstrap() {
    ModelGeneratorsModule.Register();
}