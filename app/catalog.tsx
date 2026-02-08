import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Alert,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { API_BASE_URL, BASE_URL } from "../constants/Config";
import { useCart } from "../context/CartContext";
import { useAuth } from "@/context/AuthContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 56) / 2;

// Categories will be dynamically loaded

const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(price);
};

interface Product {
    id: number | string;
    name: string;
    price: number;
    rating: number;
    reviews: number;
    image: string;
    category: string;
    isNew: boolean;
}

const getImageUrl = (imagePath: string) => {
    if (!imagePath) return "https://via.placeholder.com/300";
    if (imagePath.startsWith("http")) return imagePath;
    return `${BASE_URL}/uploads/${imagePath}`;
};

const ProductCard = ({ product }: { product: Product }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: getImageUrl(product.image),
            quantity: 1,
        });
        Alert.alert("Success", "Added to cart!");
    };

    const handlePress = () => {
        router.push(`/product/${product.id}`);
    };

    return (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.9}
            onPress={handlePress}
        >
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: getImageUrl(product.image) }}
                    style={styles.productImage}
                />
                {product.isNew && (
                    <View style={styles.newBadge}>
                        <Text style={styles.newBadgeText}>NEW</Text>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={() => setIsFavorite(!isFavorite)}
                >
                    <Ionicons
                        name={isFavorite ? "heart" : "heart-outline"}
                        size={20}
                        color={isFavorite ? "#e94560" : "#fff"}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.productInfo}>
                <Text style={styles.productCategory}>{product.category}</Text>
                <Text style={styles.productName} numberOfLines={1}>
                    {product.name}
                </Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ratingText}>{product.rating}</Text>
                    <Text style={styles.reviewsText}>({product.reviews})</Text>
                </View>
                <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
            </View>
            <TouchableOpacity
                style={styles.addToCartButton}
                onPress={handleAddToCart}
            >
                <Ionicons name="bag-add-outline" size={18} color="#fff" />
            </TouchableOpacity>
        </TouchableOpacity>
    );
};

export default function CatalogScreen() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const { cartCount } = useCart();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>(["All"]);
    const [loading, setLoading] = useState(true);
    const { logout, user } = useAuth();

    const handleProfilePress = () => {
        Alert.alert(
            "Profile",
            `Logged in as ${user?.email}`,
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: logout
                }
            ]
        );
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/products`);
            const data = await response.json();

            if (data.success) {
                const mappedProducts: Product[] = data.data.map((item: any) => ({
                    id: item._id,
                    name: item.name,
                    price: item.price,
                    rating: item.ratings?.average || 0,
                    reviews: item.ratings?.count || 0,
                    image: item.images && item.images.length > 0 ? item.images[0] : "",
                    category: item.category, // Backend category is lowercase
                    isNew: item.isFeatured || false, // Use isFeatured or date logic
                }));
                setProducts(mappedProducts);

                // Extract unique categories
                const uniqueCategories = Array.from(
                    new Set(mappedProducts.map((p) => p.category.toLowerCase()))
                ).map(cat => cat.charAt(0).toUpperCase() + cat.slice(1));

                setCategories(["All", ...uniqueCategories]);
            } else {
                Alert.alert("Error", "Failed to fetch products");
            }
        } catch (error) {
            console.error("Fetch Error:", error);
            // Fallback to sample data if connection fails (for demo purposes)
            // In production, show error message
            // Alert.alert("Error", "Could not connect to server"); 
        } finally {
            setLoading(false);
        }
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());

        // Backend categories are lowercase, Frontend categories are Title Case
        // Simplify matching by lowercasing both
        const matchesCategory =
            selectedCategory === "All" ||
            product.category.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#e94560" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <LinearGradient
                colors={["#1a1a2e", "#16213e"]}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                {/* Header */}
                <View style={styles.headerContent}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={styles.greeting}>Hello, User! 👋</Text>
                            <Text style={styles.headerTitle}>Find Your Product</Text>
                        </View>
                        <TouchableOpacity style={styles.cartButton}>
                            <Ionicons name="bag-handle-outline" size={24} color="#fff" />
                            {cartCount > 0 && (
                                <View style={styles.cartBadge}>
                                    <Text style={styles.cartBadgeText}>{cartCount}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Search Bar */}
                    <View style={styles.searchContainer}>
                        <Ionicons
                            name="search-outline"
                            size={20}
                            color="#8b8b9e"
                            style={styles.searchIcon}
                        />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search products..."
                            placeholderTextColor="#8b8b9e"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        <TouchableOpacity style={styles.filterButton}>
                            <Ionicons name="options-outline" size={20} color="#e94560" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                {/* Categories */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesContainer}
                    contentContainerStyle={styles.categoriesContent}
                >
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category}
                            style={[
                                styles.categoryButton,
                                selectedCategory === category && styles.categoryButtonActive,
                            ]}
                            onPress={() => setSelectedCategory(category)}
                        >
                            <Text
                                style={[
                                    styles.categoryText,
                                    selectedCategory === category && styles.categoryTextActive,
                                ]}
                            >
                                {category}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Section Title */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Popular Products</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                </View>

                {/* Products Grid */}
                <View style={styles.productsGrid}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <Text style={styles.noProductsText}>No products found.</Text>
                    )}
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="home" size={24} color="#e94560" />
                    <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="grid-outline" size={24} color="#8b8b9e" />
                    <Text style={styles.navText}>Categories</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Ionicons name="heart-outline" size={24} color="#8b8b9e" />
                    <Text style={styles.navText}>Wishlist</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={handleProfilePress}>
                    <Ionicons name="person-outline" size={24} color="#8b8b9e" />
                    <Text style={styles.navText}>Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f1a",
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        paddingTop: 60,
        paddingBottom: 24,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerContent: {
        paddingHorizontal: 20,
    },
    headerTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    greeting: {
        fontSize: 14,
        color: "#8b8b9e",
        marginBottom: 4,
    },
    headerTitle: {
        fontSize: 26,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.3,
    },
    cartButton: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadge: {
        position: "absolute",
        top: -4,
        right: -4,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#e94560",
        justifyContent: "center",
        alignItems: "center",
    },
    cartBadgeText: {
        fontSize: 11,
        fontWeight: "600",
        color: "#fff",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderRadius: 16,
        paddingHorizontal: 16,
        height: 52,
    },
    searchIcon: {
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: "#fff",
    },
    filterButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: "rgba(233, 69, 96, 0.15)",
        justifyContent: "center",
        alignItems: "center",
    },
    content: {
        flex: 1,
    },
    contentContainer: {
        paddingBottom: 100,
    },
    categoriesContainer: {
        marginTop: 20,
    },
    categoriesContent: {
        paddingHorizontal: 20,
        gap: 10,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        marginRight: 10,
    },
    categoryButtonActive: {
        backgroundColor: "#e94560",
    },
    categoryText: {
        fontSize: 14,
        fontWeight: "500",
        color: "#8b8b9e",
    },
    categoryTextActive: {
        color: "#fff",
    },
    sectionHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        marginTop: 28,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#fff",
    },
    seeAllText: {
        fontSize: 14,
        color: "#e94560",
        fontWeight: "500",
    },
    productsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 20,
        gap: 16,
    },
    productCard: {
        width: CARD_WIDTH,
        backgroundColor: "rgba(255, 255, 255, 0.06)",
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255, 255, 255, 0.08)",
    },
    imageContainer: {
        position: "relative",
        height: 140,
        backgroundColor: "#1a1a2e",
    },
    productImage: {
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    newBadge: {
        position: "absolute",
        top: 10,
        left: 10,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        backgroundColor: "#e94560",
    },
    newBadgeText: {
        fontSize: 10,
        fontWeight: "700",
        color: "#fff",
        letterSpacing: 0.5,
    },
    favoriteButton: {
        position: "absolute",
        top: 10,
        right: 10,
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        justifyContent: "center",
        alignItems: "center",
    },
    productInfo: {
        padding: 14,
    },
    productCategory: {
        fontSize: 11,
        color: "#8b8b9e",
        marginBottom: 4,
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    productName: {
        fontSize: 15,
        fontWeight: "600",
        color: "#fff",
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    ratingText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#fff",
        marginLeft: 4,
    },
    reviewsText: {
        fontSize: 12,
        color: "#8b8b9e",
        marginLeft: 4,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: "700",
        color: "#e94560",
    },
    addToCartButton: {
        position: "absolute",
        bottom: 14,
        right: 14,
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: "#e94560",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#e94560",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    bottomNav: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 16,
        paddingBottom: 28,
        backgroundColor: "#16213e",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
        elevation: 8,
    },
    navItem: {
        alignItems: "center",
    },
    navText: {
        fontSize: 11,
        color: "#8b8b9e",
        marginTop: 4,
    },
    navTextActive: {
        color: "#e94560",
    },
    noProductsText: {
        color: '#8b8b9e',
        fontSize: 16,
        marginTop: 20,
        textAlign: 'center',
        width: '100%',
    }
});
