function optionKeyVal(options)
{
	const newOptions = [];
	for (let option of options)
	{
		const matches = option.match(/(.*)=>(.*)/);
		if(matches)
			newOptions[matches[1].trim()] = matches[2].trim();
		else
			newOptions[option.trim()] = option.trim();
	}
	return newOptions;
}

function getExtraFieldValue(values, field_info, fieldKey)
{
	if (!field_info || !fieldKey) return '';

	if (values && fieldKey in values && values[fieldKey] !== null)
	{
		if (field_info["type"] === "date" || field_info["type"] === "datetime")
		{
			if ( !moment.isMoment(values[fieldKey]) ) {
				if (typeof values[fieldKey] === 'object' && 'date' in values[fieldKey])
					values[fieldKey] = moment(values[fieldKey].date);
				else values[fieldKey] = moment(values[fieldKey]);
			}
			return field_info["type"] === "datetime" ? values[fieldKey].format('LLL') : values[fieldKey].format('LL');
		}

		if (field_info["type"] === "choice")
		{
			const options = optionKeyVal(field_info["options"]);
			if (options && Array.isArray(values[fieldKey]))
			{
				let returnVal = "";
				for (const value of values[fieldKey])
				{
					if (returnVal) returnVal += ", ";
					returnVal += (value in options) ? options[value] : value;
				}
				return returnVal;
			}
			return (options && values[fieldKey] in options) ? options[values[fieldKey]] : values[fieldKey];
		}

		if (Array.isArray(values[fieldKey]))
			return values[fieldKey].join(', ');

		return  values[fieldKey] + ((("suffix" in field_info) && field_info["suffix"]) ? " "+field_info["suffix"] : "");
	}

	return null;
}

export { getExtraFieldValue }