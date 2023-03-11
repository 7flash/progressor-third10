const maxOptionsPerRow = 2;

export const buildInlineKeyboard = (remainingTraits: string[]): { text: string; callback_data: string }[][] => {
    const remainingOptions: { text: string; callback_data: string }[][] = [];
  
    for (let i = 0; i < remainingTraits.length; i += maxOptionsPerRow) {
      const optionsRow = remainingTraits.slice(i, i + maxOptionsPerRow).map((trait: string) => ({
        text: trait,
        callback_data: trait,
      }));
      remainingOptions.push(optionsRow);
    }
  
    return remainingOptions;
  };
  