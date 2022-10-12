import { createActions } from "reduxsauce";

const { Types, Creators } = createActions({
  handleFilter: ["kind", "values"],
});

export const FilterTypes = Types;
export default Creators;
