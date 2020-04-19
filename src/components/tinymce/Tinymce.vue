<template>
    <div class="tinymce">
        <div class="tinymce-editor tinymce-container editor-container" :class="{fullscreen:fullscreen}">
            <textarea :id="tinymceId" class="tinymce-textarea" />
            <div class="editor-custom-btn-container">
                <editor-image color="#1890ff" class="editor-upload-btn" v-on:imageSuccess="imageSuccess"></editor-image>
            </div>
        </div>
    </div>
</template>

<script>
    import plugins from './plugins'
    import toolbar from './toolbar'
    import editorImage from './EditorImage'
    export default {
        name: "Tinymce",
        components: {
            editorImage
        },
        props: {
            id: {
                type: String,
                default: function() {
                    return 'vue-tinymce-' + +new Date() + ((Math.random() * 1000).toFixed(0) + '')
                }
            },
            value: {
                type: String,
                default: ''
            },
            toolbar: {
                type: Array,
                required: false,
                default() {
                    return []
                }
            },
            menubar: {
                type: String,
                default: 'file edit insert view format table'
            },
            height: {
                type: [Number, String],
                required: false,
                default: 360
            },
            width: {
                type: [Number, String],
                required: false,
                default: 'auto'
            }
        },
        watch: {
            value(val) {
                if (!this.hasChange && this.hasInit) {
                    this.$nextTick(() =>
                        this.$tinymce.get(this.tinymceId).setContent(val || '')
                    )
                }
            }
        },
        data() {
            return {
                // 初始化配置
                hasChange: false,
                tinymceId: this.id,
                fullscreen: false,
                editorContent: '',
                hasInit: false
            }
        },
        mounted() {
            this.initTinymce();
            this.setContent(this.value)
        },
        activated() {
            if (this.$tinymce) {
                this.initTinymce()
            }
        },
        deactivated() {
            this.destroyTinymce()
        },
        destroyed() {
            this.destroyTinymce()
        },
        methods: {
            initTinymce() {
                const that = this;
                this.$tinymce.init({
                    fontsize_formats: '12px 14px 16px 18px 20px 24px 36px',
                    language: 'zh_CN',
                    language_url: '/tinymce/langs/zh_CN.js',
                    selector: `#${this.tinymceId}`,
                    height: 500,
                    body_class: 'panel-body ',
                    object_resizing: false,
                    toolbar: this.toolbar.length > 0 ? this.toolbar : toolbar,
                    menubar: this.menubar,
                    plugins: plugins,
                    end_container_on_empty_block: true,
                    powerpaste_word_import: 'clean',
                    code_dialog_height: 450,
                    code_dialog_width: 1000,
                    advlist_bullet_styles: 'square',
                    advlist_number_styles: 'default',
                    default_link_target: '_blank',
                    link_title: false,
                    nonbreaking_force_tab: true,
                    init_instance_callback: editor => {
                        if (that.value) {
                            editor.setContent(that.value)
                        }
                        that.hasInit = true;
                        editor.on('NodeChange Change KeyUp SetContent', () => {
                            this.hasChange = true;
                            that.$emit('input', editor.getContent());
                            that.editorContent = editor.getContent()
                        })
                    },
                    setup(editor) {
                        editor.on('FullscreenStateChanged', e => {
                            that.fullscreen = e.state
                        })
                    }
                })
            },
            destroyTinymce() {
                const tinymce = this.$tinymce.get(this.tinymceId);
                if (this.fullscreen) {
                    tinymce.execCommand('mceFullScreen')
                }
                if (tinymce) {
                    tinymce.destroy()
                }
            },
            // 设置编辑器内容
            setContent(value) {
                this.$tinymce.get(this.tinymceId).setContent(value)
            },
            // 获取编辑器内容
            getContent() {
                this.$tinymce.get(this.tinymceId).getContent()
            },
            // 图片上传成功后填充到富文本编辑器
            async imageSuccess(urlList) {
                try {
                    let imageTemplateList = '';
                    urlList.forEach(item => {
                        const image = `<img style="max-width:100%;" src="${item}">`;
                        imageTemplateList = imageTemplateList + image
                    });
                    this.$tinymce.get(this.tinymceId).insertContent(imageTemplateList);
                    this.$message.success('上传成功')
                } catch (error) {
                    this.$message.error(error.msg)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    .tinymce-container {
        position: relative;
        line-height: normal;
    }
    .tinymce-container>>>.mce-fullscreen {
        z-index: 10000;
    }
    .tinymce-textarea {
        visibility: hidden;
        z-index: -1;
    }
    .editor-custom-btn-container {
        position: absolute;
        right: 4px;
        top: 4px;
        z-index: 1;
    }
    .fullscreen .editor-custom-btn-container {
        z-index: 10000;
        position: fixed;
    }
    .editor-upload-btn {
        display: inline-block;
    }
</style>