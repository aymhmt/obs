package utils

func HarfNotu(ort float64) string {
	switch {
	case ort >= 90:
		return "AA"
	case ort >= 85:
		return "BA"
	case ort >= 80:
		return "BB"
	case ort >= 75:
		return "CB"
	case ort >= 70:
		return "CC"
	case ort >= 65:
		return "DC"
	case ort >= 60:
		return "DD"
	case ort >= 50:
		return "FD"
	default:
		return "FF"
	}
}