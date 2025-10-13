export function useGetSelectedValue() {
  const getSelectedValue = (value, statusOptions) => {
    const option = statusOptions.find((opt) => opt.value === value);
    return option ? option.label : "";
  };

  return { getSelectedValue };
}
