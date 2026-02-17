namespace RS1_2024_25.API.Helper;
using System.Text.Json;
using System.Text.Json.Serialization;

public class TimeOnlyJsonConverter : JsonConverter<TimeOnly>
{
    public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.StartObject)
        {
            int hour = 0;
            int minute = 0;

            while (reader.Read())
            {
                if (reader.TokenType == JsonTokenType.EndObject)
                    break;

                if (reader.TokenType == JsonTokenType.PropertyName)
                {
                    var propertyName = reader.GetString();
                    reader.Read();
                    if (propertyName == "hour")
                        hour = reader.GetInt32();
                    else if (propertyName == "minute")
                        minute = reader.GetInt32();
                }
            }

            return new TimeOnly(hour, minute);
        }

        throw new JsonException("Expected a JSON object with 'hour' and 'minute' fields for TimeOnly.");
    }

    public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
    {
        writer.WriteStartObject();
        writer.WriteNumber("hour", value.Hour);
        writer.WriteNumber("minute", value.Minute);
        writer.WriteEndObject();
    }
}